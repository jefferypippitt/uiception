# Unslop

A pass to run against everything written during personalization — the
`about` bio, the contact intro, and every `content/writing/*.mdx` /
`content/books/*.mdx` entry. This applies whenever `AGENTS.md` has you
drafting prose for this site, not just once.

## Process

1. Draft the content per `AGENTS.md`.
2. Before you're done, read it back against every pattern below.
3. Rewrite what trips a pattern. Preserve the meaning and the person's real
   voice — don't flatten it, just strip the tells.
4. Self-audit once more: "would this specific sentence survive if a human
   who does this work for real wrote it?" If not, cut or rewrite it.

## Patterns to detect and fix

### Style

1. **Em dash overuse.** One sentence with two em dashes is the single most
   common tell in generated bios. Use a period or comma instead.
   - Bad: "I build products end to end — frontend, backend, and
     infrastructure — and I'd rather have something live than perfect."
   - Better: "I build products end to end: frontend, backend,
     infrastructure. I'd rather have something live than perfect."
2. **Colon as a mid-sentence connector.** "The mechanism is simple once you
   see it:" or "The honest version:" add nothing — they're a wind-up
   before the actual sentence. Cut the wind-up, state the point.
3. **Manufactured profundity.** A pull-quote or closing line that sounds
   like a fortune cookie is a tell, not a flourish.
   - Bad: "The best infrastructure is the kind you stop noticing. Nobody
     should think about the deck. They should think about the talk."
   - Just say what happened: "I built it because I got tired of tethering
     a laptop to a projector just to glance at my own notes."
4. **Decorative technical notation.** Don't dress up a plain idea as a
   formula or diagram to look rigorous — `$$\text{time to first working
   page} \to \text{one command}$$` for "install is one command" is exactly
   this. Only use math/tables for content that's actually quantitative.
5. **Rhetorical essay openers.** "X reads like Y until you realize Z" and
   similar setup-then-reveal openings are a generated-essay pattern. Open
   with the actual fact or event instead.
6. **Title case headings, curly quotes, decorative emphasis.** Sentence
   case headings, straight quotes, and no bolding every proper noun.

### Language

7. **AI vocabulary.** Additionally, crucial, delve, enduring, fostering,
   garner, interplay, intricate, landscape (abstract), pivotal, showcase,
   tapestry, testament, underscore, vibrant, "at the intersection of."
   Replace with the plain word or cut.
8. **Fancy ways to say "is."** "serves as", "stands as", "boasts". Just say
   "is" or "has."
9. **"Not just X, but Y."** State the point directly.
10. **Rule of three.** Don't force two real examples into three by padding
    a filler item. Use the number that's actually true.
11. **Vague attribution.** "People say", "it's widely known" — if there's
    no source, cut the claim or make it a fact you can stand behind.

### Length

17. **Padding past the point.** AI drafts tend to run long — an extra
    sentence restating what the previous one said, a closing paragraph that
    summarizes instead of ending, an implication spelled out that the
    reader already got. `AGENTS.md` gives you a word-count budget for the
    bio and each entry, measured against what you're replacing — if you're
    over it, the fix is almost always to cut a sentence, not tighten the
    wording of all of them.
18. **One idea per section, not three angles on it.** If two paragraphs are
    making the same point from different sides, keep the sharper one and
    delete the other.

### Voice

12. **Say what happened, not how it felt.** "made the workflow seamless"
    names a feeling. "cut the review step from three tools to one" names a
    fact. If a sentence could sit unchanged in anyone else's portfolio,
    it says nothing about this one — cut it or make it specific.
13. **Active voice, real actor.** "the score was improved by streaming the
    response" becomes "streaming the response improved the score."
14. **Cut adverbs propping up a weak verb.** "runs significantly faster"
    becomes the actual number, or a stronger verb.
15. **Plain word over the fancier synonym.** "utilize" → "use", "leverage"
    → "use", "facilitate" → "help", "numerous" → "many."
16. **Chatbot artifacts.** No "I hope this helps," no apologizing, no
    address to a reader who isn't there — this is a bio and a blog post,
    not a chat reply.

## Sound test

Read the final paragraph out loud. If it sounds like something written
*about* the person rather than *by* them, it's still slopped.
