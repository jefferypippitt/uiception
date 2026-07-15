import { existsSync } from "node:fs"
import { join } from "node:path"

import { NavbarSectionV1Root } from "./navbar-section-v1-root"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/navbar-section-v1/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

export default function NavbarSectionV1() {
  return <NavbarSectionV1Root logoSrc={blockImage("logo.svg")} />
}
