import { createBlockImage } from "@/lib/block-media"

import { TeamSectionV2Root } from "./team-section-v2-root"
import { teamFiles, type TeamMember } from "../lib/config"

const blockImage = createBlockImage("team-section-v2")

const teamMembers: TeamMember[] = teamFiles.map((member, index) => ({
  id: String(index + 1),
  name: member.name,
  title: member.title,
  avatarSrc: blockImage(member.file),
}))

export type TeamSectionV2Props = {
  members?: TeamMember[]
}

export default function TeamSectionV2({
  members = teamMembers,
}: TeamSectionV2Props = {}) {
  return <TeamSectionV2Root members={members} />
}
