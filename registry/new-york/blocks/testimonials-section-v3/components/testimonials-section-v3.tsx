import TestimonialGrid from "./testimonial-grid"

export default function TestimonialsSectionV3() {
  return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-4xl font-medium tracking-tighter sm:text-5xl md:mb-10 lg:mb-12">
          Explore Success Stories
        </h2>
        <TestimonialGrid />
      </div>
    </section>
  )
}
