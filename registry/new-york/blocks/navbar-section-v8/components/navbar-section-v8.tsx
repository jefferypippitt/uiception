import { NavbarSectionV8Root } from "./navbar-section-v8-root"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("navbar-section-v8")
export default function NavbarSectionV8() {
  return <NavbarSectionV8Root logoSrc={blockImage("logo.svg")} />
}
