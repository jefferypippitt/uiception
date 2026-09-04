import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"

import type { Contributor } from "../lib/changelog-content"
import {
  MAX_VISIBLE_CONTRIBUTORS,
  formatContributorNames,
} from "../lib/changelog-format"

export default function ContributorGroup({
  contributors,
}: {
  contributors: Contributor[]
}) {
  // Never more than three avatars — anyone past that is covered by the names
  // label ("…and 2 others"), so there is no "+N" count bubble.
  const visible = contributors.slice(0, MAX_VISIBLE_CONTRIBUTORS)

  return (
    <div className="flex items-center gap-3">
      <AvatarGroup className="shrink-0">
        {visible.map((person) => (
          <Avatar key={person.id} size="sm">
            <AvatarImage
              src={person.avatarSrc}
              alt={person.name}
              className="object-cover object-center"
            />
            <AvatarFallback>{person.initials}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
      <span className="min-w-0 text-sm font-medium text-foreground">
        {formatContributorNames(contributors)}
      </span>
    </div>
  )
}
