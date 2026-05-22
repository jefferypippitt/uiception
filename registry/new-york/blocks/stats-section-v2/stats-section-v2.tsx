import { Suspense } from "react"

import { BRANDS } from "./series"
import { getSeriesData } from "./api"
import DownloadsPanel from "./downloads-panel"

export default async function StatsSectionV2() {
  const allData = await Promise.all(BRANDS.map(getSeriesData))

  return (
    <section className="py-10 md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-xl font-medium tracking-tight md:text-2xl">
          Trusted by millions of <br />
          developers around the world
        </h2>

        <Suspense>
          <DownloadsPanel seriesData={allData} />
        </Suspense>
      </div>
    </section>
  )
}
