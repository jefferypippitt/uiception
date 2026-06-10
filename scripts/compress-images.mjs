import sharp from "sharp";
import { readdir, readFile, stat, writeFile } from "fs/promises";
import { join, extname } from "path";

const BLOCK_IMAGES_DIR = "public/images/blocks";
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
const SKIP_BELOW_KB = 200; // don't reprocess already-small files

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

async function compress(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return;

  const before = (await stat(filePath)).size;
  if (before < SKIP_BELOW_KB * 1024) return;

  const input = await readFile(filePath);
  const image = sharp(input).resize(MAX_WIDTH, MAX_HEIGHT, {
    fit: "inside",
    withoutEnlargement: true,
  });

  let output;
  if (ext === ".png") {
    output = await image
      .png({ compressionLevel: 9, effort: 10 })
      .toBuffer();
  } else {
    output = await image.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  }

  if (output.length >= before) return; // skip if not smaller

  await writeFile(filePath, output);

  const after = output.length;
  const pct = Math.round((1 - after / before) * 100);
  console.log(
    `  ${filePath.replace(BLOCK_IMAGES_DIR + "/", "")}  ${kb(before)} → ${kb(after)}  (${pct}%)`,
  );
}

function kb(bytes) {
  return `${Math.round(bytes / 1024)}KB`;
}

const files = await getFiles(BLOCK_IMAGES_DIR);
console.log(`Scanning ${files.length} files in ${BLOCK_IMAGES_DIR}...\n`);

let compressed = 0;
for (const file of files) {
  const before = (await stat(file)).size;
  await compress(file);
  const after = (await stat(file)).size;
  if (after < before) compressed++;
}

console.log(`\nDone. ${compressed} file(s) compressed.`);
