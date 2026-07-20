"use client"

import { useFormStatus } from "react-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

import { contactFormAction } from "../lib/actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Spinner data-icon="inline-start" />
          Sending...
        </>
      ) : (
        "Send message"
      )}
    </Button>
  )
}

export function ContactForm() {
  async function handleSubmit(formData: FormData) {
    const result = await contactFormAction(formData)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    if (result?.success) {
      toast.success("Message sent successfully!")
    }
  }

  return (
    <form action={handleSubmit}>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              required
              autoComplete="name"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              required
              autoComplete="email"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <Textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Project details, timeline, and anything else I should know..."
              required
            />
          </Field>
          <Field orientation="horizontal">
            <SubmitButton />
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
