// Example: Fumadocs installation commands
export const TAB_OPTIONS = ["npm", "pnpm", "yarn", "bun"] as const
export type TabOption = (typeof TAB_OPTIONS)[number]

export const COMMANDS: Record<TabOption, string> = {
  npm: "npm i fumadocs-mdx fumadocs-core @types/mdx",
  pnpm: "pnpm add fumadocs-mdx fumadocs-core @types/mdx",
  yarn: "yarn add fumadocs-mdx fumadocs-core @types/mdx",
  bun: "bun add fumadocs-mdx fumadocs-core @types/mdx",
}
