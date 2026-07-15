import { NavbarSectionV7Root } from "./navbar-section-v7-root"
import { createBlockImage } from "@/lib/block-media"

const blockImage = createBlockImage("navbar-section-v7")
export default function NavbarSectionV7() {
  return <NavbarSectionV7Root logoSrc={blockImage("logo.svg")} />
}
