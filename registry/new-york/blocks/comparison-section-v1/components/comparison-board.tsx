import {
  groups,
  products,
  type ComparisonGroup,
  type ComparisonRow,
  type Product,
} from "../lib/comparison"

export default function ComparisonBoard() {
  return (
    <div className="mt-12 overflow-x-auto md:mt-16">
      <div
        role="table"
        aria-label="NVIDIA, AMD, and Intel"
        className="grid min-w-[44rem] grid-cols-[minmax(8.75rem,11.5rem)_repeat(3,minmax(0,1fr))] gap-x-4"
      >
        <div role="row" className="col-span-full grid grid-cols-subgrid">
          <div role="columnheader" className="flex items-end pb-5">
            <span className="sr-only">Point</span>
            <span aria-hidden className="text-xs text-muted-foreground">
              {groups[0].label}
            </span>
          </div>
          {products.map((product) => (
            <div
              key={product.id}
              role="columnheader"
              className="px-1 pt-6 pb-5 text-foreground"
            >
              <ProductIdentity product={product} />
            </div>
          ))}
        </div>

        {groups.map((group, groupIndex) => (
          <GroupRows key={group.id} group={group} groupIndex={groupIndex} />
        ))}
      </div>
    </div>
  )
}

function GroupRows({
  group,
  groupIndex,
}: {
  group: ComparisonGroup
  groupIndex: number
}) {
  const lastGroup = groupIndex === groups.length - 1

  return (
    <>
      {groupIndex > 0 ? (
        <div role="row" className="col-span-full grid grid-cols-subgrid">
          <div
            role="rowheader"
            className="flex items-end pt-10 pb-2 text-xs text-muted-foreground"
          >
            {group.label}
          </div>
        </div>
      ) : null}
      {group.rows.map((row, rowIndex) => (
        <DataRow
          key={row.id}
          row={row}
          groupLabel={groupIndex === 0 && rowIndex === 0 ? group.label : undefined}
          last={lastGroup && rowIndex === group.rows.length - 1}
        />
      ))}
    </>
  )
}

function DataRow({
  row,
  last,
  groupLabel,
}: {
  row: ComparisonRow
  last: boolean
  groupLabel?: string
}) {
  return (
    <div role="row" className="col-span-full grid grid-cols-subgrid">
      <div
        role="rowheader"
        className={
          last
            ? "flex items-end pr-4 pt-4 pb-6 text-sm leading-snug font-medium text-foreground"
            : "flex items-end py-4 pr-4 text-sm leading-snug font-medium text-foreground"
        }
      >
        {groupLabel ? (
          <span className="sr-only">{`${groupLabel}, ${row.criterion}`}</span>
        ) : null}
        {groupLabel ? <span aria-hidden>{row.criterion}</span> : row.criterion}
      </div>
      {products.map((product) => (
        <div key={product.id} role="cell" className={cellClass(last)}>
          <span className="text-pretty">{row.cells[product.id]}</span>
        </div>
      ))}
    </div>
  )
}

function cellClass(last: boolean) {
  return [
    "flex items-end border-t border-border px-1 pt-4 text-sm leading-snug text-pretty text-foreground",
    last ? "border-b pb-6" : "pb-4",
  ].join(" ")
}

function ProductIdentity({ product }: { product: Product }) {
  return (
    <div>
      <span className="flex h-8 items-center">
        <CompanyLogo product={product} />
      </span>
      <span className="sr-only">{product.name}</span>
    </div>
  )
}

function CompanyLogo({ product }: { product: Product }) {
  const Light = product.logoLight
  const Dark = product.logoDark

  return (
    <span aria-hidden className="inline-flex items-center">
      <Light
        aria-hidden
        className={Dark ? `${product.logoClassName} dark:hidden` : product.logoClassName}
      />
      {Dark ? (
        <Dark
          aria-hidden
          className={`${product.logoClassName} hidden dark:block`}
        />
      ) : null}
    </span>
  )
}
