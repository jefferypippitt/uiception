/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "motion", "radix-ui", "@base-ui/react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75],
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
