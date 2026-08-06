export type FeatureIconId =
  | "code"
  | "terminal"
  | "folders"
  | "wrench"
  | "package"
  | "compass"

export type FeatureDefinition = {
  id: string
  title: string
  description: string
  /** Exact word or phrase within `description` to render bold for emphasis. */
  emphasis: string
  icon: FeatureIconId
}

export const sectionTitle = "Durable AI agents in your filesystem"

export const featureSectionItems: FeatureDefinition[] = [
  {
    id: "typescript-agents",
    title: "TypeScript agents",
    description:
      "eve agents are plain TypeScript projects. Add files under agent/ to describe yours, and eve keeps it running as a durable service.",
    emphasis: "TypeScript",
    icon: "code",
  },
  {
    id: "install-locally",
    title: "Install & run locally",
    description:
      "Create a project, configure a model credential, and run it locally. From there, grow your first agent into a full app.",
    emphasis: "locally",
    icon: "terminal",
  },
  {
    id: "project-structure",
    title: "Project structure",
    description:
      "See which files eve looks for and where each capability lives, so your folder layout defines your tools, skills, and channels.",
    emphasis: "layout",
    icon: "folders",
  },
  {
    id: "tools-state",
    title: "Tools, state & interface",
    description:
      "Build a real workflow by adding typed tools, state that stays durable across sessions, and an interface people can use to talk to the agent.",
    emphasis: "typed",
    icon: "wrench",
  },
  {
    id: "simple-prereqs",
    title: "Simple prerequisites",
    description:
      "You just need Node.js 24 or newer, npm, and a credential for whatever model your agent uses. That's everything required to get started.",
    emphasis: "everything",
    icon: "package",
  },
  {
    id: "next-steps",
    title: "Start where you are",
    description:
      "New to eve? Start with Installation. Already have a workspace? Jump straight into Project structure.",
    emphasis: "Installation",
    icon: "compass",
  },
]
