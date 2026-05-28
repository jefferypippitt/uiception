import { ArrowRight } from "lucide-react"

import ChatBot from "../../chat-bot/components/chat-bot"
import { Badge } from "@/components/ui/badge"

export default function HeroSectionV3() {
  return (
    <section className="pt-10 pb-16 md:pt-14 md:pb-20 lg:pt-16 lg:pb-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge variant="secondary" className="text-sm italic">
            Always open, always ready
          </Badge>

          <h1 className="text-3xl font-medium tracking-tighter sm:text-4xl lg:text-5xl lg:leading-[1.15]">
            Hospitality that never keeps
            <br />
            your guests waiting
          </h1>

          <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
            From taking reservations to answering menu questions and handling
            special dietary requests, your guests get instant answers any time
            of day.
          </p>

          <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            Sign up for free
            <ArrowRight data-icon="inline-end" size={16} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-4">
        <ChatBot className="mx-auto max-w-3xl py-10" />
      </div>
    </section>
  )
}
