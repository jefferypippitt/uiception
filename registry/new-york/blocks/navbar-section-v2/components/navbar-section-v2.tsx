import { NavbarSectionV2Root } from "./navbar-section-v2-root"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("navbar-section-v2")
export default function NavbarSectionV2() {
  return <NavbarSectionV2Root logoSrc={blockImage("logo.svg")} />
}
