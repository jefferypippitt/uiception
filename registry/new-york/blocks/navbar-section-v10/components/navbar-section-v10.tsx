import { existsSync } from "node:fs"
import { join } from "node:path"

import { NavbarSectionV10Root } from "./navbar-section-v10-root"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/navbar-section-v10/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

export default function NavbarSectionV10() {
  return <NavbarSectionV10Root logoSrc={blockImage("logo.svg")} />
}
