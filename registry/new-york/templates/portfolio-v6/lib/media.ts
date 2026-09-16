import { existsSync } from "node:fs"
import { join } from "node:path"

import {
  IMAGE_EXTENSIONS,
  createTemplateImage,
} from "@/lib/block-media"

export { IMAGE_EXTENSIONS } from "@/lib/block-media"

const TEMPLATE_ID = "portfolio-v6"
const CDN_ORIGIN = "https://uiception.com"

export function resolveAvatarSrc(origin = CDN_ORIGIN): string {
  const installDir = join(process.cwd(), "public")
  for (const ext of IMAGE_EXTENSIONS) {
    const filename = `avatar${ext}`
    if (existsSync(join(installDir, filename))) {
      return `/${filename}`
    }
  }

  return createTemplateImage(TEMPLATE_ID, origin)("avatar.png")
}
