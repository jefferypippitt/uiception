"use client"

import { registerCompanyIcons } from "./lifeline/company-icon"
import { CursorDark } from "./ui/svgs/cursorDark"
import { CursorLight } from "./ui/svgs/cursorLight"
import { NvidiaIconDark } from "./ui/svgs/nvidiaIconDark"
import { NvidiaIconLight } from "./ui/svgs/nvidiaIconLight"
import { Vercel } from "./ui/svgs/vercel"
import { VercelDark } from "./ui/svgs/vercelDark"

registerCompanyIcons({
  vercel: { icon: Vercel, darkIcon: VercelDark },
  cursor: { icon: CursorLight, darkIcon: CursorDark },
  nvidia: { icon: NvidiaIconLight, darkIcon: NvidiaIconDark },
})

export function ClaireCompanyIcons() {
  return null
}
