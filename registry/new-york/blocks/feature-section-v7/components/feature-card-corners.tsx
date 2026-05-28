const cornerClassName =
  "pointer-events-none absolute z-10 size-1.5 bg-foreground"

export function FeatureCardCorners() {
  return (
    <>
      <span className={`${cornerClassName} top-0 left-0 -translate-x-1/2 -translate-y-1/2`} aria-hidden />
      <span
        className={`${cornerClassName} top-0 right-0 translate-x-1/2 -translate-y-1/2`}
        aria-hidden
      />
      <span
        className={`${cornerClassName} bottom-0 left-0 -translate-x-1/2 translate-y-1/2`}
        aria-hidden
      />
      <span
        className={`${cornerClassName} bottom-0 right-0 translate-x-1/2 translate-y-1/2`}
        aria-hidden
      />
    </>
  )
}
