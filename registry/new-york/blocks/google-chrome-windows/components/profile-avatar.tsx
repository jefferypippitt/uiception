import { chromeWindowsConfig } from "../lib/config"

export default function ProfileAvatar() {
  return (
    <span
      className="gcw-profile"
      style={{ backgroundColor: chromeWindowsConfig.profileBg }}
      aria-hidden
    >
      <span className="gcw-profile-letter">{chromeWindowsConfig.profileInitial}</span>
    </span>
  )
}
