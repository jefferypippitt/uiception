import { NavbarSectionV6Root } from "./navbar-section-v6-root"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("navbar-section-v6")
export default function NavbarSectionV6() {
  return <NavbarSectionV6Root logoSrc={blockImage("logo.svg")} />
}
