/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "motion", "radix-ui", "@base-ui/react"],
  },
  images: {
    formats: ["image/webp", "image/avif"],
    qualities: [75],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uiception.com",
        pathname: "/images/**",
      },
    ],
  },
  async headers() {
    const raw =
      process.env.NEXT_PUBLIC_HTML_IN_CANVAS_OT_TOKEN?.trim() ||
      process.env.HTML_IN_CANVAS_ORIGIN_TRIAL?.trim() ||
      ""

    if (!raw) return []

    const tokens = raw
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean)

    if (tokens.length === 0) return []

    return [
      {
        source: "/:path*",
        headers: tokens.map((value) => ({
          key: "Origin-Trial",
          value,
        })),
      },
    ]
  },
}

export default nextConfig
