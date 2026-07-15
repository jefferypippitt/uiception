import { existsSync } from "node:fs"
import { join } from "node:path"

import { NavbarSectionV2Root } from "./navbar-section-v2-root"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/navbar-section-v2/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

export default function NavbarSectionV2() {
  return <NavbarSectionV2Root logoSrc={blockImage("logo.svg")} />
}
