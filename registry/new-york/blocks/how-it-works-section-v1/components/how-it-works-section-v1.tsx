import StepsGrid from "./steps-grid"
import "../styles/how-it-works-section-v1.css"

export default function HowItWorksSectionV1() {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 flex flex-col items-center text-center md:mb-16">
          <h2 className="max-w-2xl text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-green-600 dark:text-green-400">3 Steps</span>{" "}
            To Ship
            <br />
            Faster Than Ever
          </h2>
        </div>
        <StepsGrid />
      </div>
    </section>
  )
}
