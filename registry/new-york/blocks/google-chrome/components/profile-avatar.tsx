import { chromeConfig } from "../lib/config"

export default function ProfileAvatar() {
  return (
    <div
      className="grid size-8 shrink-0 place-items-center rounded-full"
      style={{ background: chromeConfig.profileBg }}
    >
      <span className="translate-y-[-0.08em] text-sm leading-none font-semibold tracking-normal text-(--gc-profile-letter-fg) lowercase [text-shadow:0_0.5px_0_(--gc-profile-letter-shadow)]">
        {chromeConfig.profileInitial}
      </span>
    </div>
  )
}
