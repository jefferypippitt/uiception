import { existsSync } from "node:fs"
import { join } from "node:path"

import { NavbarSectionV8Root } from "./navbar-section-v8-root"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/navbar-section-v8/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

export default function NavbarSectionV8() {
  return <NavbarSectionV8Root logoSrc={blockImage("logo.svg")} />
}
