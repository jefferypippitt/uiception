import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    // Not in Next's ExperimentalConfig type on this version — safe to leave
    // in, but view transitions here work without it (React's <ViewTransition>
    // is what actually drives them; see components/directional-transition.tsx).
    // @ts-expect-error -- viewTransition isn't a recognized experimental key yet
    viewTransition: true,
  },
}

export default nextConfig
