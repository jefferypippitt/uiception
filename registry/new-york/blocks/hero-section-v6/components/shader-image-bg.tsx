import { forwardRef } from "react"
import { PerlinNoise } from "@paper-design/shaders-react"

const ShaderImageBg = forwardRef<HTMLDivElement>(function ShaderImageBg(_, ref) {
  return (
    <div ref={ref} className="hero-v6-noise-frame" aria-hidden>
      <PerlinNoise
        width={1280}
        height={720}
        colorBack="#ffffff"
        colorFront="#262626"
        proportion={0.65}
        softness={0.35}
        octaveCount={6}
        persistence={1}
        lacunarity={2.55}
        speed={0.02}
        scale={4}
      />
    </div>
  )
})

export default ShaderImageBg
