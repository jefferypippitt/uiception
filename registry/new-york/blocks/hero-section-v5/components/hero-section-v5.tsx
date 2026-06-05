import { Instrument_Serif } from "next/font/google"

import { Button } from "@/components/ui/button"
import SimpleChatbot from "../../simple-chatbot/components/simple-chatbot"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
})

const HOME_SEARCH_PROMPTS = [
  "Show me 3-bedroom homes under $500k in Austin.",
  "What neighborhoods have the best schools nearby?",
  "Find pet-friendly rentals with a backyard.",
  "Schedule a tour for this listing this weekend.",
  "Compare mortgage rates for a $400k home.",
  "What's the average home price in Denver?",
] as const

export default function HeroSectionV5() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1
            className={`${instrumentSerif.className} text-3xl font-medium sm:text-4xl lg:text-5xl lg:leading-[1.15]`}
          >
            Find your perfect home
            <br />
            with <span className="italic">confidence</span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Browse thousands of verified listings, connect with trusted agents
            and make your next move without the stress.
          </p>

          <Button variant="default" className="rounded-full">
            Get started
          </Button>
        </div>
      </div>

      <div className="px-4 pt-4">
        <SimpleChatbot prompts={HOME_SEARCH_PROMPTS} />
      </div>
    </section>
  )
}
