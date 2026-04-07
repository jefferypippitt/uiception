import CtaButtons from "./cta-buttons"

const TITLE_WORDS = ["Turn", "AI", "from", "noise", "into", "results."]

export default function HeroContent() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="font-serif text-3xl font-medium tracking-tighter sm:text-4xl lg:text-5xl lg:leading-[1.15]">
        {TITLE_WORDS.map((word, i) => (
          <span
            key={i}
            data-hero-v4-word
            className="inline-block"
          >
            {i < TITLE_WORDS.length - 1 ? word + "\u00A0" : word}
          </span>
        ))}
      </h1>

      <div data-hero-v4-reveal>
        <p className="max-w-xl text-base leading-7 tracking-tight text-muted-foreground sm:text-lg sm:leading-8">
          We find where AI can save you time and money, then build the systems
          that make it happen.
        </p>
      </div>

      <div data-hero-v4-reveal>
        <CtaButtons />
      </div>
    </div>
  )
}
