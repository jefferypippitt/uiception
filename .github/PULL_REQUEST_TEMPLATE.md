## Summary

<!-- What does this PR change, and why? -->

## Type of change

- [ ] New block
- [ ] Bug fix
- [ ] Feature / enhancement
- [ ] Refactor
- [ ] Docs
- [ ] Other

## Checklist

- [ ] `pnpm check` passes locally (`registry:validate` + `test:run` + `typecheck`)
- [ ] `pnpm build` succeeds locally
- [ ] Commits are signed (required by branch protection on `main`)
- [ ] If this adds/removes a block: updated all 4 places (block folder, `lib/blocks.ts`,
      `registry.json`, `components/block-preview-by-version.tsx`)
- [ ] If this adds a new category: updated all 4 `title-<id>` selectors in `app/globals.css`
- [ ] No hardcoded colors — theme tokens used for light/dark mode
- [ ] Links use `<Link href="#">`, not raw `<a>` tags

## Screenshots / recordings

<!-- For visual changes, include a before/after screenshot or short clip. -->

## Related issue

<!-- Closes #123 -->
