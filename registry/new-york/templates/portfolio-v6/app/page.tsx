import { ArrowUpRight } from "lucide-react"

import { ResumeRow } from "../components/resume-row"
import { ResumeSection } from "../components/resume-section"
import { portfolio } from "../lib/portfolio"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <ResumeSection title="About">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {portfolio.about}
        </p>
      </ResumeSection>

      <ResumeSection title="Work Experience">
        {portfolio.experience.map((job) => (
          <ResumeRow key={`${job.company}-${job.dates}`} date={job.dates}>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                {job.role} at{" "}
                <a
                  href={job.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {job.company}
                </a>
              </p>
              {job.location ? (
                <p className="text-sm text-muted-foreground">{job.location}</p>
              ) : null}
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {job.description}
              </p>
            </div>
          </ResumeRow>
        ))}
      </ResumeSection>

      <ResumeSection title="Side Projects">
        {portfolio.projects.map((project) => (
          <ResumeRow key={project.name} date={project.dates}>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {project.name}
                </a>
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
            </div>
          </ResumeRow>
        ))}
      </ResumeSection>

      <ResumeSection title="Awards">
        {portfolio.awards.map((award) => (
          <ResumeRow key={`${award.year}-${award.name}`} date={award.year}>
            <p className="text-sm font-medium text-foreground">{award.name}</p>
          </ResumeRow>
        ))}
      </ResumeSection>

      <ResumeSection title="Certifications">
        {portfolio.certificates.map((cert) => (
          <ResumeRow key={`${cert.year}-${cert.name}`} date={cert.year}>
            <p className="text-sm font-medium text-foreground">
              <a
                href={cert.href}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                {cert.name}
              </a>
            </p>
          </ResumeRow>
        ))}
      </ResumeSection>

      <ResumeSection title="Education">
        {portfolio.education.map((edu) => (
          <ResumeRow key={`${edu.dates}-${edu.school}`} date={edu.dates}>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">{edu.detail}</p>
              <p className="text-sm text-muted-foreground">
                <a
                  href={edu.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {edu.school}
                </a>
              </p>
              {edu.description ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {edu.description}
                </p>
              ) : null}
            </div>
          </ResumeRow>
        ))}
      </ResumeSection>

      <ResumeSection title="Contact">
        {portfolio.contact.map((row) => (
          <ResumeRow key={row.label} date={row.label}>
            <a
              href={row.href}
              target={row.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={row.href.startsWith("mailto:") ? undefined : "noreferrer"}
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
            >
              {row.value}
              <ArrowUpRight className="size-3.5 text-muted-foreground" />
            </a>
          </ResumeRow>
        ))}
      </ResumeSection>
    </div>
  )
}
