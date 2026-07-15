import { NavbarSectionV5Root } from "./navbar-section-v5-root"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("navbar-section-v5")
export default function NavbarSectionV5() {
  return <NavbarSectionV5Root logoSrc={blockImage("logo.svg")} />
}
