import { existsSync } from "node:fs"
import { join } from "node:path"

import { NavbarSectionV5Root } from "./navbar-section-v5-root"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/navbar-section-v5/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

export default function NavbarSectionV5() {
  return <NavbarSectionV5Root logoSrc={blockImage("logo.svg")} />
}
