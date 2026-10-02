"use client"

import type { FormEvent } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Wire this up to your own endpoint or form service.
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="contact-name">Name</FieldLabel>
            <Input
              id="contact-name"
              name="name"
              autoComplete="name"
              placeholder="Jane Doe"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="contact-email">Email</FieldLabel>
            <Input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@acme.com"
              required
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="contact-company">
            Company <span className="text-muted-foreground">(optional)</span>
          </FieldLabel>
          <Input
            id="contact-company"
            name="company"
            autoComplete="organization"
            placeholder="Acme"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-message">Message</FieldLabel>
          <Textarea
            id="contact-message"
            name="message"
            placeholder="A few lines about the project, timeline, and budget."
            required
          />
        </Field>
        <Button type="submit" className="w-full sm:w-fit">
          Send message
          <ArrowRight className="size-4" />
        </Button>
      </FieldGroup>
    </form>
  )
}
