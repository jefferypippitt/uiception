export type TeamMember = {
  id: string
  name: string
  title: string
  avatarSrc: string
}

export const sectionHeader = {
  title: "The people behind Acme",
  description:
    "You'll talk to the same six people whether you report a bug or ask about pricing.",
} as const

export const teamFiles = [
  { file: "avatar-1.png", name: "Jane Doe", title: "VP of Engineering" },
  { file: "avatar-2.png", name: "John Doe", title: "Director of Operations" },
  { file: "avatar-3.png", name: "Jane Smith", title: "Chief Product Officer" },
  { file: "avatar-4.png", name: "John Smith", title: "Head of Autonomy" },
  { file: "avatar-5.png", name: "Alex Johnson", title: "Staff Data Engineer" },
  { file: "avatar-6.png", name: "Sam Wilson", title: "SVP of Digital" },
] as const
