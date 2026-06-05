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
}

export default nextConfig
