import { ClaireCompanyIcons } from "../components/company-icons"
import { Avatar } from "../components/avatar"
import { Lifeline, LifelineLegend } from "../components/lifeline"
import {
  LifelineFooter,
  LifelineNav,
  LifelineShell,
  LifelineStage,
} from "../components/lifeline-shell"
import { ThemeSwitcher } from "../components/theme-switcher"
import { getJonDoeLifeline } from "../lib/media"

export default function HomePage() {
  const life = getJonDoeLifeline()

  return (
    <LifelineShell className="lifeline-typeset">
      <LifelineNav
        logo={
          <span className="flex items-center gap-3">
            <Avatar />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              {life.name}
            </span>
          </span>
        }
        logoLabel={life.name}
      >
        <ThemeSwitcher />
      </LifelineNav>

      <ClaireCompanyIcons />

      <LifelineStage>
        <Lifeline
          markers={life.markers}
          birthYear={life.birthYear}
          title={life.name}
          className="h-full"
        />
      </LifelineStage>

      <LifelineFooter containerClassName="justify-center">
        <LifelineLegend items={life.legend} />
      </LifelineFooter>
    </LifelineShell>
  )
}
