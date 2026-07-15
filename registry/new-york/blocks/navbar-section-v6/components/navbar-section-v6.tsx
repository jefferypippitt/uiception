import { existsSync } from "node:fs"
import { join } from "node:path"

import { NavbarSectionV6Root } from "./navbar-section-v6-root"

const blockImage = (filename: string) => {
  const relPath = `images/blocks/navbar-section-v6/${filename}`
  const hasLocal = existsSync(join(process.cwd(), "public", relPath))
  return hasLocal ? `/${relPath}` : `https://uiception.com/${relPath}`
}

export default function NavbarSectionV6() {
  return <NavbarSectionV6Root logoSrc={blockImage("logo.svg")} />
}
