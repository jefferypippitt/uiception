import { NavbarSectionV3Root } from "./navbar-section-v3-root"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("navbar-section-v3")
export default function NavbarSectionV3() {
  return <NavbarSectionV3Root logoSrc={blockImage("logo.svg")} />
}
