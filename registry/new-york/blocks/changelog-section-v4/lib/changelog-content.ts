import { createBlockImage } from "@/lib/block-media"

const blockAvatar = createBlockImage("changelog-section-v4")

export type Contributor = {
  id: string
  name: string
  initials: string
  avatarSrc: string
}

export type ChangelogEntry = {
  id: string
  /** ISO date (YYYY-MM-DD). Entries that share a date render under one date group. */
  date: string
  title: string
  description: string
  contributors: Contributor[]
}

export const sectionMeta = {
  title: "What's New",
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
    id: "realtime-collaborative-editing",
    date: "2026-09-02",
    title: "Realtime Collaborative Editing",
    description:
      "Multiple teammates can now edit the same agent session at once, with live cursors and instant conflict resolution baked in.",
    contributors: [people.mei, people.claire],
  },
  {
    id: "custom-agent-personas",
    date: "2026-09-02",
    title: "Custom Agent Personas",
    description:
      "Define tone, guardrails, and default tools once, then apply the same persona across every project your team ships.",
    contributors: [people.ethan, people.jordan, people.ryan],
  },
  {
    id: "faster-cold-starts",
    date: "2026-08-25",
    title: "Faster Cold Starts",
    description:
      "Agent sandboxes now boot in under 400ms on average, down from 1.2s, by keeping a warm pool ready across regions.",
    contributors: [people.hannah],
  },
  {
    id: "audit-log-export",
    date: "2026-08-10",
    title: "Audit Log Export",
    description:
      "Stream every agent action to your own SIEM or data warehouse in near real time, with a schema that stays stable across releases.",
    contributors: [people.ryan, people.mei],
  },
  {
    id: "team-roles-and-permissions",
    date: "2026-08-10",
    title: "Team Roles & Permissions",
    description:
      "Granular roles now scope exactly which repos, environments, and spend limits each teammate's agents can touch.",
    contributors: [people.claire, people.ethan, people.hannah, people.jordan],
  },
]
