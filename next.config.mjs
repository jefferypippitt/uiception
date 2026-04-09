/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
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
