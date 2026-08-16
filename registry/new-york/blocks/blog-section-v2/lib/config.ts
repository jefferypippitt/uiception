export const author = {
  label: "Author",
  name: "Jon Doe",
  title: "Fullstack Developer",
  avatarFile: "avatar.png",
  initials: "JD",
  githubHref: "https://github.com/",
  githubLabel: "GitHub",
} as const

export const sections = [
  {
    title: "Golden Hour Field Notes",
    description:
      "Last light on the mountains, and the work you leave unfinished on purpose.",
    imageFile: "image-1.jpg",
    alt: "Mountain landscape at golden hour",
    body: "There is a short window when the mountains keep time. Shadows climb the ridges in minutes, and I have to decide where to stand and what to leave out of the frame before the color drains. I treat that hour the way I treat a shipping deadline. The hard edge makes the rest of the day honest. I can walk the trail again in the morning, and I cannot get this light back.",
  },
  {
    title: "A Walk Along the Cliffs",
    description:
      "Notes from a coastal path where the weather changes faster than the plan.",
    imageFile: "image-2.jpg",
    alt: "Coastal cliffs and ocean waves",
    body: "Spray hits the path. The ocean keeps the same argument it has always kept with the shore. I walk slower than usual on days like this. The ground is difficult. The water is loud, and that makes room for quieter thoughts about what to build next and what to delete.",
  },
] as const
