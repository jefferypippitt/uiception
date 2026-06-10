import { execFile } from "child_process";
import { readdir, stat, rename, unlink } from "fs/promises";
import { join, extname } from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const BLOCK_VIDEOS_DIR = "public/videos/blocks";
const MAX_WIDTH = 1280;
const SKIP_BELOW_MB = 2;

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = join(dir, entry.name);
      return entry.isDirectory() ? getFiles(full) : full;
    }),
  );
  return files.flat();
}

async function probe(filePath) {
  const { stdout } = await execFileAsync("ffprobe", [
    "-v", "quiet",
    "-print_format", "json",
    "-show_streams",
    filePath,
  ]);
  const { streams } = JSON.parse(stdout);
  const video = streams.find((s) => s.codec_type === "video");
  return { width: video?.width, height: video?.height, fps: eval(video?.r_frame_rate) };
}

async function compress(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext !== ".mp4") return;

  const before = (await stat(filePath)).size;
  if (before < SKIP_BELOW_MB * 1024 * 1024) return;

  const { width, fps } = await probe(filePath);
  const needsResize = width > MAX_WIDTH;
  const needsFpsReduction = fps > 30;

  if (!needsResize && !needsFpsReduction) {
    console.log(`  skip  ${filePath}  (${width}px, ${fps}fps — already within limits)`);
    return;
  }

  const tmp = filePath + ".tmp.mp4";

  const scaleFilter = `scale='min(${MAX_WIDTH},iw)':-2`;
  const args = [
    "-i", filePath,
    "-vf", scaleFilter,
    "-r", "30",
    "-c:v", "libx264",
    "-crf", "28",
    "-maxrate", "1500k",
    "-bufsize", "3000k",
    "-preset", "slow",
    "-an",
    "-movflags", "+faststart",
    "-y", tmp,
  ];

  try {
    await execFileAsync("ffmpeg", args);
  } catch (err) {
    await unlink(tmp).catch(() => {});
    throw err;
  }

  const after = (await stat(tmp)).size;

  if (after >= before) {
    await unlink(tmp);
    console.log(`  skip  ${filePath}  (output not smaller)`);
    return;
  }

  await rename(tmp, filePath);

  const pct = Math.round((1 - after / before) * 100);
  console.log(
    `  ${filePath}  ${mb(before)} → ${mb(after)}  (${pct}%)`,
  );
}

function mb(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

const files = await getFiles(BLOCK_VIDEOS_DIR);
console.log(`Scanning ${files.length} files in ${BLOCK_VIDEOS_DIR}...\n`);

let compressed = 0;
for (const file of files) {
  const before = (await stat(file)).size;
  await compress(file);
  const after = (await stat(file)).size;
  if (after < before) compressed++;
}

console.log(`\nDone. ${compressed} file(s) compressed.`);
