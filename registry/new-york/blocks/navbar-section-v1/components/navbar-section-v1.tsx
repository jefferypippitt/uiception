import { NavbarSectionV1Root } from "./navbar-section-v1-root"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("navbar-section-v1")
export default function NavbarSectionV1() {
  return <NavbarSectionV1Root logoSrc={blockImage("logo.svg")} />
}
