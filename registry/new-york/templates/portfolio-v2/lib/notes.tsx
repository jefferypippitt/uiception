import type { ReactNode } from "react"

export type Note = {
  slug: string
  title: string
  date: string
  description?: string
  body: () => ReactNode
}

const notes: Note[] = [
  {
    slug: "agents-that-survive-a-restart",
    title: "Agents that survive a restart",
    date: "2025-11-12",
    description: "Why I stopped treating an agent like a function that either works or vanishes.",
    body: () => (
      <>
        <p>
          I used to think of an agent as one long function call. You send a
          message, something happens, you get an answer back. That mental
          model works fine in a demo and falls apart the moment a real task
          takes longer than a few seconds, a server restarts, or a person
          steps away and comes back an hour later expecting the conversation
          to still make sense.
        </p>
        <p>
          What actually holds up is treating every step the agent takes as
          something worth saving. Not just the final answer, but where it
          was in the middle of a task, what it had already decided, what it
          was still waiting on. When it can pick up from that saved point
          instead of starting over, a crash stops being a disaster and
          becomes something closer to a hiccup.
        </p>
        <p>
          The word for this took me a while to appreciate. Durable. It
          sounds like a small engineering detail until the day your agent
          survives a deploy in the middle of a task and nobody even notices.
        </p>
      </>
    ),
  },
  {
    slug: "a-chatbot-is-a-codebase",
    title: "A chatbot is a codebase",
    date: "2025-09-03",
    description: "The day I stopped writing one giant prompt and started building an actual app.",
    body: () => (
      <>
        <p>
          For a long time my agents were one enormous prompt with everything
          crammed into it. The personality, the rules, the tool
          descriptions, the edge cases somebody hit three weeks ago that I
          patched with one more sentence. It worked, in the way a single
          file with four thousand lines of code works. Which is to say,
          barely, and only for me.
        </p>
        <p>
          The shift that actually helped was treating the agent like a real
          project instead of a clever paragraph. A short file that says who
          it is. A folder of skills it can read when a task calls for them.
          Small tools it can reach for instead of pretending it can do
          everything from memory. Once I gave it that shape, I could open
          the project six months later and still understand why it behaves
          the way it does.
        </p>
        <p>
          A chatbot people trust is rarely one clever prompt. It is a small,
          honest codebase that happens to talk.
        </p>
      </>
    ),
  },
  {
    slug: "the-human-in-the-loop-is-not-optional",
    title: "The human in the loop is not optional",
    date: "2025-06-18",
    description: "Some actions deserve a person's eyes before they happen, not after.",
    body: () => (
      <>
        <p>
          Early on I let an agent send an email on its own, and it was fine,
          right up until it was not. Nothing catastrophic, just a message
          that went out a little too early with a tone nobody had approved.
          A small mistake, but it taught me something about where autonomy
          earns trust and where it has not yet.
        </p>
        <p>
          Now anything that touches money, sends something a person cannot
          unsend, or changes a record we cannot easily reverse gets a pause
          built in. The agent still does the thinking. It drafts the plan,
          it explains what it wants to do and why. A person just has to
          actually look at it before it becomes real.
        </p>
        <p>
          That pause is not a lack of confidence in the model. It is respect
          for the fact that some moments deserve a witness.
        </p>
      </>
    ),
  },
  {
    slug: "one-agent-many-rooms",
    title: "One agent, many rooms",
    date: "2025-03-01",
    description: "The same agent shows up in Slack, on the web, and in a terminal, and has to feel like itself everywhere.",
    body: () => (
      <>
        <p>
          I built an agent for our team and the first version only lived in
          one place, a chat window on a webpage. Then someone asked if it
          could live in Slack too. Then someone else wanted it in a script
          that ran from the terminal at two in the morning. Suddenly the
          same brain needed to show up in three very different rooms and
          behave like it belonged in each one.
        </p>
        <p>
          The trick was keeping the thinking in one place and letting only
          the surface change. The part that decides what to do stayed the
          same no matter where the message came from. What changed was how
          a response got formatted, how long a message could be, whether a
          button made sense or a plain line of text was all the room could
          offer.
        </p>
        <p>
          It is a strangely fullstack problem. The model barely changes.
          Everything else, the delivery, the formatting, the little manners
          of each platform, is where most of the real work quietly lives.
        </p>
      </>
    ),
  },
]

export function getNotes() {
  return [...notes].sort((a, b) => b.date.localeCompare(a.date))
}

export function getNote(slug: string) {
  return notes.find((note) => note.slug === slug)
}

export function formatNoteDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number)
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1))
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}
