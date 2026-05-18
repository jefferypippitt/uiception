export type PipelineRun = {
  id: string
  source: string
  transform: string
  destinations: string[]
  latencyMs: number
}

/** Example runs — replace with your product’s events and destinations. */
export const PIPELINE_RUNS: PipelineRun[] = [
  {
    id: "evt_8f2a91",
    source: "user.created",
    transform: "enrich.profile",
    destinations: ["Slack", "Salesforce"],
    latencyMs: 47,
  },
  {
    id: "evt_3c17bd",
    source: "invoice.paid",
    transform: "map.revenue",
    destinations: ["Salesforce", "Stripe"],
    latencyMs: 62,
  },
  {
    id: "evt_d904e2",
    source: "ticket.opened",
    transform: "route.owner",
    destinations: ["Slack", "Stripe"],
    latencyMs: 38,
  },
  {
    id: "evt_51aa0f",
    source: "account.updated",
    transform: "sync.crm",
    destinations: ["Slack", "Salesforce"],
    latencyMs: 54,
  },
]

export const PIPELINE_STAGES = [
  {
    id: "ingest",
    label: "Ingest",
    detail: "Webhooks & streams",
  },
  {
    id: "transform",
    label: "Transform",
    detail: "Map · filter · enrich",
  },
  {
    id: "deliver",
    label: "Deliver",
    detail: "Apps & APIs",
  },
] as const

/** Destination badges — swap labels and ids for your integrations. */
export const DESTINATION_CHIPS = [
  { id: "slack", label: "Slack" },
  { id: "salesforce", label: "Salesforce" },
  { id: "stripe", label: "Stripe" },
] as const

export type DestinationId = (typeof DESTINATION_CHIPS)[number]["id"]
