import { createBlockImage } from "@/lib/block-media"

const blockAvatar = createBlockImage("changelog-section-v3")

export type Contributor = {
  id: string
  name: string
  initials: string
  avatarSrc: string
}

export type ChangelogEntry = {
  id: string
  /** ISO date (YYYY-MM-DD). Entries that share a date render under one timeline node. */
  date: string
  title: string
  description: string
  contributors: Contributor[]
}

export const sectionMeta = {
  title: "Changelog",
}

const people = {
  claire: {
    id: "claire-donovan",
    name: "Claire Donovan",
    initials: "CD",
    avatarSrc: blockAvatar("avatar-1.png"),
  },
  ethan: {
    id: "ethan-morrison",
    name: "Ethan Morrison",
    initials: "EM",
    avatarSrc: blockAvatar("avatar-2.png"),
  },
  mei: {
    id: "mei-lin-chen",
    name: "Mei Lin Chen",
    initials: "MC",
    avatarSrc: blockAvatar("avatar-3.png"),
  },
  jordan: {
    id: "jordan-ellis",
    name: "Jordan Ellis",
    initials: "JE",
    avatarSrc: blockAvatar("avatar-4.png"),
  },
  hannah: {
    id: "hannah-bergstrom",
    name: "Hannah Bergstrom",
    initials: "HB",
    avatarSrc: blockAvatar("avatar-5.png"),
  },
  ryan: {
    id: "ryan-park",
    name: "Ryan Park",
    initials: "RP",
    avatarSrc: blockAvatar("avatar-6.png"),
  },
} satisfies Record<string, Contributor>

export const changelog: ChangelogEntry[] = [
  {
    id: "composable-tool-sdk",
    date: "2026-09-02",
    title: "Composable Tool SDK",
    description:
      "Our new tool primitives let you build and deploy AI coding agents faster. Mix, chain, and extend them to fit however your team works.",
    contributors: [people.claire, people.ethan, people.mei],
  },
  {
    id: "deep-codebase-context",
    date: "2026-09-02",
    title: "Deep Codebase Context",
    description:
      "Your agents can now reason across multiple repositories, branches, and file trees all within a single session.",
    contributors: [people.jordan, people.hannah],
  },
  {
    id: "intelligent-model-routing",
    date: "2026-08-21",
    title: "Intelligent Model Routing",
    description:
      "Agents now pick the right model for each task on their own, so you get the best balance of speed, cost, and quality without lifting a finger.",
    contributors: [people.ryan, people.mei, people.claire, people.ethan],
  },
]
