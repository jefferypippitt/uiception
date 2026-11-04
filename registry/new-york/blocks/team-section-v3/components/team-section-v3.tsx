import { createBlockImage } from "@/lib/block-media"

import { TeamSectionV3Root } from "./team-section-v3-root"
import { teamFiles, type TeamMember } from "../lib/config"

const blockImage = createBlockImage("team-section-v3")

const teamMembers: TeamMember[] = teamFiles.map((member, index) => ({
  id: String(index + 1),
  name: member.name,
  title: member.title,
  avatarSrc: blockImage(member.file),
}))

export type TeamSectionV3Props = {
  members?: TeamMember[]
}

export default function TeamSectionV3({
  members = teamMembers,
}: TeamSectionV3Props = {}) {
  return <TeamSectionV3Root members={members} />
}
