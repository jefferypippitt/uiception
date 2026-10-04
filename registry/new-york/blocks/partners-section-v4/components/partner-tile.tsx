import PartnerIcon from "./partner-icon"
import type { Partner } from "../lib/partners"

export default function PartnerTile({ partner }: { partner: Partner }) {
  return (
    <li className="flex items-center justify-center odd:-translate-y-2 even:translate-y-2 sm:odd:-translate-y-4 sm:even:translate-y-4 lg:odd:-translate-y-6 lg:even:translate-y-6">
      <PartnerIcon partner={partner} className="size-7 sm:size-10 lg:size-14" />
      <span className="sr-only">{partner.name}</span>
    </li>
  )
}
