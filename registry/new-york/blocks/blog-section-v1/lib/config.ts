export const sectionMeta = {
  title: "All Articles",
  spotlightLabel: "Spotlight",
  trendingLabel: "Trending",
} as const

export const spotlight = {
  imageFile: "image-1.jpg",
  alt: "Mountain landscape at golden hour",
  title:
    "How Real-Time Collaboration Transformed Product Delivery for Distributed Teams",
  href: "#",
  author: {
    name: "Maya Chen",
    avatarFile: "avatar-1.png",
  },
} as const

export const trending = [
  {
    imageFile: "image-2.jpg",
    alt: "Coastal cliffs and ocean waves",
    title:
      "How Real-Time Collaboration Transformed Product Delivery for Distributed Teams",
    href: "#",
  },
  {
    imageFile: "image-3.jpg",
    alt: "Forest trail through tall trees",
    title:
      "What is Design System Governance? A Practical Guide for Growing Product Teams",
    href: "#",
  },
  {
    imageFile: "image-4.jpg",
    alt: "City skyline at dusk",
    title:
      "Shipping in Public: Building Trust Through Transparent Product Roadmaps",
    href: "#",
  },
] as const
