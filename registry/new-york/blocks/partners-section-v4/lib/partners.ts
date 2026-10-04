import type { ComponentType, SVGProps } from "react"

import { AwsLight } from "@/components/ui/svgs/awsLight"
import { AwsDark } from "@/components/ui/svgs/awsDark"
import { Cloudflare } from "@/components/ui/svgs/cloudflare"
import { Digitalocean } from "@/components/ui/svgs/digitalocean"
import { Docker } from "@/components/ui/svgs/docker"
import { Kubernetes } from "@/components/ui/svgs/kubernetes"
import { Gitlab } from "@/components/ui/svgs/gitlab"
import { Pulumi } from "@/components/ui/svgs/pulumi"
import { Grafana } from "@/components/ui/svgs/grafana"

export type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>

export type Partner = {
  name: string
  light: SvgComponent
  dark?: SvgComponent
}

export const partners: Partner[] = [
  { name: "AWS",          light: AwsLight, dark: AwsDark },
  { name: "Cloudflare",   light: Cloudflare },
  { name: "DigitalOcean", light: Digitalocean },
  { name: "Docker",       light: Docker },
  { name: "Kubernetes",   light: Kubernetes },
  { name: "GitLab",       light: Gitlab },
  { name: "Pulumi",       light: Pulumi },
  { name: "Grafana",      light: Grafana },
]
