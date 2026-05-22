export const chromeConfig = {
  /** Content area min-height — Windows mockup uses a larger value so total shell height matches */
  defaultViewportMinHeight: "32rem",
  tabTitle: "New Tab",
  omniboxPlaceholder: "Search Google or type a URL",
  /** Default omnibox typewriter phrases — pass your own to `GoogleChrome` for SaaS demos */
  omniboxTypingPrompts: ["facebook.com"] as const,
  bookmarksAppsLabel: "Apps",
  profileInitial: "j",
  profileBg: "#14b8a6",
} as const
