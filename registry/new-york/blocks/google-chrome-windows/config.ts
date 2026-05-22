export const chromeWindowsConfig = {
  /**
   * Taller than macOS viewport min so total shell height matches `google-chrome`
   * (macOS adds a bookmarks bar; Windows titlebar/toolbar are aligned to mac min-heights).
   */
  defaultViewportMinHeight: "33.75rem",
  tabTitle: "New Tab",
  omniboxPlaceholder: "Ask Google or type a URL",
  /** Default omnibox typewriter phrases — pass your own to `GoogleChromeWindows` for SaaS demos */
  omniboxTypingPrompts: ["youtube.com"] as const,
  profileInitial: "j",
  profileBg: "#14b8a6",
} as const
