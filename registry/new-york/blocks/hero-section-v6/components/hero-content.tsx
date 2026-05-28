import CtaButtons from "./cta-buttons"

const TITLE_WORDS = ["Run", "payroll", "faster", "with", "fewer", "errors."]

export default function HeroContent() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="max-w-[18ch] text-3xl tracking-tighter sm:text-4xl lg:text-5xl lg:leading-[1.15]">
        {TITLE_WORDS.map((word, i) => (
          <span key={i} data-hero-v6-word className="inline-block">
            {i < TITLE_WORDS.length - 1 ? word + " " : word}
          </span>
        ))}
      </h1>

      <div data-hero-v6-reveal>
        <p className="max-w-xl text-base leading-7 tracking-tight text-muted-foreground sm:text-lg sm:leading-8">
          Automate approvals, sync time tracking, and catch anomalies before
          payday with a payroll workspace built for finance teams.
        </p>
      </div>

      <div data-hero-v6-reveal>
        <CtaButtons />
      </div>
    </div>
  )
}
