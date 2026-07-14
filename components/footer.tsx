import Link from "next/link"

import { siteConfig } from "@/lib/config"

export default function Footer() {
  return (
    <footer className="py-6">
      <div className="mx-auto w-full max-w-6xl px-6">
        <p className="text-balance text-center text-sm text-muted-foreground">
          Built by{" "}
          <Link
            href={siteConfig.author.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {siteConfig.author.name}
          </Link>
          . The source code is available on{" "}
          <Link
            href={`${siteConfig.links.github}/uiception`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            GitHub
          </Link>
          .
        </p>
      </div>
    </footer>
  )
}
