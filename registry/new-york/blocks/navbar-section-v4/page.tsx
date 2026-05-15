import LoremDemo from "./lorem-demo"
import NavbarSectionV4 from "./navbar-section-v4"

export default function Page() {
  return (
    <>
      <NavbarSectionV4 />
      <div className="pb-32 sm:pb-28">
        <LoremDemo />
      </div>
    </>
  )
}
