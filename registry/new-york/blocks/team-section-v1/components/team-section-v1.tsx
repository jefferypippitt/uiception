import { createBlockImage } from "@/lib/block-media"

import { TeamSectionV1Root } from "./team-section-v1-root"
import { teamFiles, type TeamMember } from "../lib/config"

const blockImage = createBlockImage("team-section-v1")

const teamMembers: TeamMember[] = teamFiles.map((member, index) => ({
  id: String(index + 1),
  name: member.name,
  title: member.title,
  avatarSrc: blockImage(member.file),
}))

export type TeamSectionV1Props = {
  members?: TeamMember[]
}

export default function TeamSectionV1({
  members = teamMembers,
}: TeamSectionV1Props = {}) {
  return <TeamSectionV1Root members={members} />
}
