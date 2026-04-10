import type { ComponentType, SVGProps } from "react"

import { TiktokIconLight } from "@/components/ui/svgs/tiktokIconLight"
import { TiktokIconDark } from "@/components/ui/svgs/tiktokIconDark"
import { Bluesky } from "@/components/ui/svgs/bluesky"
import { Reddit } from "@/components/ui/svgs/reddit"
import { RedditDark } from "@/components/ui/svgs/redditDark"
import { Meta } from "@/components/ui/svgs/meta"
import { MetaDark } from "@/components/ui/svgs/metaDark"
import { X } from "@/components/ui/svgs/x"
import { XDark } from "@/components/ui/svgs/xDark"
import { InstagramIcon } from "@/components/ui/svgs/instagramIcon"
import { InstagramIconDark } from "@/components/ui/svgs/instagramIconDark"
import { Telegram } from "@/components/ui/svgs/telegram"
import { TelegramDark } from "@/components/ui/svgs/telegramDark"
import { Youtube } from "@/components/ui/svgs/youtube"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type Brand = {
  name: string
  Icon: SvgComponent
  darkIcon?: SvgComponent
  color: string
  darkColor?: string
}

export const brands: Brand[] = [
  { name: "TikTok",    Icon: TiktokIconLight, darkIcon: TiktokIconDark,       color: "#EE1D52" },
  { name: "Bluesky",   Icon: Bluesky,                                          color: "#0085FF" },
  { name: "Reddit",    Icon: Reddit,          darkIcon: RedditDark,            color: "#FF4500" },
  { name: "Meta",      Icon: Meta,            darkIcon: MetaDark,              color: "#0082FB" },
  { name: "X",         Icon: X,               darkIcon: XDark,                color: "#000000", darkColor: "#FFFFFF" },
  { name: "Instagram", Icon: InstagramIcon,   darkIcon: InstagramIconDark,     color: "#E1306C" },
  { name: "Telegram",  Icon: Telegram,        darkIcon: TelegramDark,          color: "#2AABEE" },
  { name: "YouTube",   Icon: Youtube,                                          color: "#FF0000" },
]
