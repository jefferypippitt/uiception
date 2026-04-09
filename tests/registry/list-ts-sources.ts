import { readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"

export function listTsSourcesUnder(dir: string, root: string): string[] {
  const out: string[] = []
  const walk = (abs: string) => {
    for (const name of readdirSync(abs)) {
      const p = join(abs, name)
      const st = statSync(p)
      if (st.isDirectory()) walk(p)
      else if (st.isFile() && /\.(ts|tsx)$/.test(name)) {
        out.push(relative(root, p).split("\\").join("/"))
      }
    }
  }
  walk(dir)
  return out
}
