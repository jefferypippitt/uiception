import { existsSync } from "node:fs"
import { join } from "node:path"

import { NavbarSectionV3Root } from "./navbar-section-v3-root"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/navbar-section-v3/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

export default function NavbarSectionV3() {
  return <NavbarSectionV3Root logoSrc={blockImage("logo.svg")} />
}
