import { useEffect, useRef } from "react"
import gsap from "gsap"

export function useHeroAnimation() {
  const titleRef  = useRef<HTMLHeadingElement>(null)
  const descRef   = useRef<HTMLParagraphElement>(null)
  const streamRef = useRef<HTMLDivElement>(null)
  const brandsRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

      // Initial states are set in JSX — animate forward with to()
      tl.to(titleRef.current!.querySelectorAll(".word"), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.07,
      })

      .to(descRef.current, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.9,
        ease: "power3.out",
      }, "-=0.45")

      .to(streamRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotationX: 0,
        transformPerspective: 1000,
        transformOrigin: "50% 0%",
        duration: 1.1,
        ease: "expo.out",
      }, "<0.1")

      .to(brandsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.5")
    })

    return () => ctx.revert()
  }, [])

  return { titleRef, descRef, streamRef, brandsRef }
}
