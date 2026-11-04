import {
  charts,
  companies,
  type Company,
  type ComparisonBar,
  type ComparisonChart,
} from "../lib/comparison"

const companyById = new Map(companies.map((company) => [company.id, company]))

export default function ComparisonChartList() {
  return (
    <div className="mt-12 flex max-w-3xl flex-col gap-14 md:mt-16">
      {charts.map((chart) => (
        <Chart key={chart.id} chart={chart} />
      ))}
    </div>
  )
}

function Chart({ chart }: { chart: ComparisonChart }) {
  return (
    <section aria-label={chart.label}>
      <h3 className="text-xs text-muted-foreground">{chart.label}</h3>
      <ul className="mt-2">
        {chart.bars.map((bar) => {
          const company = companyById.get(bar.companyId)
          if (!company) return null
          return <BarRow key={bar.companyId} company={company} bar={bar} />
        })}
      </ul>
    </section>
  )
}

function BarRow({ company, bar }: { company: Company; bar: ComparisonBar }) {
  return (
    <li className="border-b border-border py-4">
      <div className="flex items-center justify-between gap-4">
        <span className="flex min-w-0 items-center gap-2.5">
          <CompanyLogo company={company} />
          {company.wordmark ? (
            <span className="sr-only">{company.name}</span>
          ) : (
            <span className="text-sm font-medium text-foreground">{company.name}</span>
          )}
          {company.note ? (
            <span className="text-sm text-muted-foreground">{company.note}</span>
          ) : null}
        </span>
        <span className="shrink-0 text-sm text-foreground tabular-nums">{bar.value}</span>
      </div>
      <div aria-hidden className="mt-3 h-2 rounded-full bg-muted">
        <div className={`h-full rounded-full bg-foreground ${bar.widthClass}`} />
      </div>
    </li>
  )
}

function CompanyLogo({ company }: { company: Company }) {
  const Light = company.logoLight
  const Dark = company.logoDark

  return (
    <span aria-hidden className="inline-flex h-6 shrink-0 items-center">
      <Light
        aria-hidden
        className={
          Dark ? `${company.logoClassName} dark:hidden` : company.logoClassName
        }
      />
      {Dark ? (
        <Dark aria-hidden className={`${company.logoClassName} hidden dark:block`} />
      ) : null}
    </span>
  )
}
