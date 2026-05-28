/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    viewTransition: true,
    optimizePackageImports: ["@phosphor-icons/react", "motion", "radix-ui", "@base-ui/react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
