import type { ComponentType, SVGProps } from "react"

import { InstagramIcon } from "@/components/ui/svgs/instagramIcon"
import { InstagramIconDark } from "@/components/ui/svgs/instagramIconDark"
import { Youtube } from "@/components/ui/svgs/youtube"
import { LinkedinIcon } from "@/components/ui/svgs/linkedinIcon"
import { LinkedinIconDark } from "@/components/ui/svgs/linkedinIconDark"
import { X } from "@/components/ui/svgs/x"
import { XDark } from "@/components/ui/svgs/xDark"
import { Reddit } from "@/components/ui/svgs/reddit"
import { RedditDark } from "@/components/ui/svgs/redditDark"
import { Bluesky } from "@/components/ui/svgs/bluesky"
import { Telegram } from "@/components/ui/svgs/telegram"
import { TelegramDark } from "@/components/ui/svgs/telegramDark"
import { Slack } from "@/components/ui/svgs/slack"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type Partner = {
  name: string
  light: SvgComponent
  dark?: SvgComponent
}

export const partners: Partner[] = [
  { name: "Instagram", light: InstagramIcon, dark: InstagramIconDark },
  { name: "YouTube",   light: Youtube },
  { name: "LinkedIn",  light: LinkedinIcon,  dark: LinkedinIconDark },
  { name: "X",         light: X,             dark: XDark },
  { name: "Reddit",    light: Reddit,        dark: RedditDark },
  { name: "Bluesky",   light: Bluesky },
  { name: "Telegram",  light: Telegram,      dark: TelegramDark },
  { name: "Slack",     light: Slack },
]
