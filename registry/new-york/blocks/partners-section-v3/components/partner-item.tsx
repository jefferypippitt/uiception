import PartnerIcon from "./partner-icon"
import type { Partner } from "../lib/partners"

export default function PartnerItem({ partner }: { partner: Partner }) {
  return (
    <li
      data-pv3-item
      className="flex items-center gap-4 py-2 sm:gap-5 md:py-3"
    >
      <PartnerIcon partner={partner} className="size-9 shrink-0 sm:size-11 lg:size-14" />
      <span className="text-4xl leading-none font-medium tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
        {partner.name}
      </span>
    </li>
  )
}
