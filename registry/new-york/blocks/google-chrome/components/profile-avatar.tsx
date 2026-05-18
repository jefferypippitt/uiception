import { chromeConfig } from "../lib/config"

export default function ProfileAvatar() {
  return (
    <span
      className="gc-profile"
      style={{ backgroundColor: chromeConfig.profileBg }}
      aria-hidden
    >
      <span className="gc-profile-letter">{chromeConfig.profileInitial}</span>
    </span>
  )
}
