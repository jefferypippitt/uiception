import { Instrument_Serif } from "next/font/google"

import { Button } from "@/components/ui/button"
import SimpleChatbot from "./components/simple-chatbot"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
})

export default function HeroSectionV5() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className={`${instrumentSerif.className} text-3xl font-medium sm:text-4xl lg:text-5xl lg:leading-[1.15]`}>
            Find your perfect home
            <br />
            with <span className="italic">confidence</span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Browse thousands of verified listings, connect with trusted agents
            and make your next move without the stress.
          </p>

          <Button variant="default" className="rounded-full">Get started</Button>
        </div>
      </div>

      <div className="px-4 pt-4">
        <SimpleChatbot />
      </div>
    </section>
  )
}
