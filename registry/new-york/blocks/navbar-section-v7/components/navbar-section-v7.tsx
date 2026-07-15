import { existsSync } from "node:fs"
import { join } from "node:path"

import { NavbarSectionV7Root } from "./navbar-section-v7-root"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/navbar-section-v7/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

export default function NavbarSectionV7() {
  return <NavbarSectionV7Root logoSrc={blockImage("logo.svg")} />
}
