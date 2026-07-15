import { NavbarSectionV10Root } from "./navbar-section-v10-root"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("navbar-section-v10")
export default function NavbarSectionV10() {
  return <NavbarSectionV10Root logoSrc={blockImage("logo.svg")} />
}
