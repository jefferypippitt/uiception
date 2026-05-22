import { ensureUiceptionBlockMedia } from "@/lib/ensure-uiception-block-media"

import GoogleChromeWindowsWithVideo from "./google-chrome-windows-with-video"

export default async function Page() {
  await ensureUiceptionBlockMedia("google-chrome-windows-with-video")
  return (
    <div className="px-4 py-10 md:px-6 md:py-14">
      <GoogleChromeWindowsWithVideo />
    </div>
  )
}
