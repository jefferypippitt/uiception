import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const ORIGIN = "https://uiception.test"

describe("ensureUiceptionBlockMedia", () => {
  let cwd: string
  let previousCwd: string

  beforeEach(() => {
    previousCwd = process.cwd()
    cwd = mkdtempSync(join(tmpdir(), "uiception-media-"))
    process.chdir(cwd)
    vi.stubEnv("UICEPTION_MEDIA_ORIGIN", ORIGIN)
    vi.stubEnv("UICEPTION_SKIP_MEDIA_FETCH", "")
  })

  afterEach(() => {
    process.chdir(previousCwd)
    rmSync(cwd, { recursive: true, force: true })
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it("downloads missing media from manifest installUrl", async () => {
    const target = "public/images/blocks/demo/hero.jpg"
    const installUrl = `${ORIGIN}/images/blocks/demo/hero.jpg`
    const bytes = Buffer.from([0xff, 0xd8, 0xff, 0x00])

    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url === `${ORIGIN}/r/demo-block.json`) {
          return new Response(
            JSON.stringify({
              files: [
                {
                  type: "registry:file",
                  target,
                  meta: { installUrl },
                },
              ],
            }),
            { status: 200 },
          )
        }
        if (url === installUrl) {
          return new Response(bytes, { status: 200 })
        }
        return new Response(null, { status: 404 })
      }),
    )

    const { ensureUiceptionBlockMedia } = await import(
      "@/lib/ensure-uiception-block-media"
    )
    await ensureUiceptionBlockMedia("demo-block")

    const outPath = join(cwd, target)
    expect(existsSync(outPath)).toBe(true)
    expect(readFileSync(outPath)).toEqual(bytes)
  })

  it("skips download when the file already exists", async () => {
    const target = "public/images/blocks/demo/hero.jpg"
    const installUrl = `${ORIGIN}/images/blocks/demo/hero.jpg`
    const outPath = join(cwd, target)
    const { mkdirSync, writeFileSync } = await import("node:fs")
    const { dirname } = await import("node:path")
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, Buffer.from("existing"))

    const fetchMock = vi.fn(async (url: string) => {
      if (url === `${ORIGIN}/r/demo-block.json`) {
        return new Response(
          JSON.stringify({
            files: [
              {
                type: "registry:file",
                target,
                meta: { installUrl },
              },
            ],
          }),
          { status: 200 },
        )
      }
      return new Response(null, { status: 404 })
    })
    vi.stubGlobal("fetch", fetchMock)

    const { ensureUiceptionBlockMedia } = await import(
      "@/lib/ensure-uiception-block-media"
    )
    await ensureUiceptionBlockMedia("demo-block")

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(readFileSync(outPath).toString()).toBe("existing")
  })

  it("no-ops when UICEPTION_SKIP_MEDIA_FETCH is set", async () => {
    vi.stubEnv("UICEPTION_SKIP_MEDIA_FETCH", "1")
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    const { ensureUiceptionBlockMedia } = await import(
      "@/lib/ensure-uiception-block-media"
    )
    await ensureUiceptionBlockMedia("demo-block")

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("returns without error when the block manifest is missing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, { status: 404 })),
    )

    const { ensureUiceptionBlockMedia } = await import(
      "@/lib/ensure-uiception-block-media"
    )
    await expect(ensureUiceptionBlockMedia("missing-block")).resolves.toBeUndefined()
  })
})
