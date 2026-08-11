"use client"

import * as React from "react"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "./ui/questionnaire"
import { toast } from "./ui/toast"

import { registerAction } from "../lib/actions"
import { site } from "../lib/site"

const items = site.register.questions.map((question) => ({
  name: question.name,
  required: question.required,
  choices: question.choices.map((choice) => ({ value: choice.value })),
}))

export function RegisterForm() {
  const [done, setDone] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Questionnaire only fires onSubmit after required steps validate.
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setPending(true)
    setError(null)

    try {
      const result = await registerAction(formData)

      if ("error" in result) {
        setError(result.error)
        toast.add({
          type: "error",
          title: result.error,
        })
        return
      }

      setDone(true)
      toast.add({
        type: "success",
        title: site.register.successTitle,
        description: site.register.successDescription,
      })
    } catch {
      const message = "Something went wrong. Please try again."
      setError(message)
      toast.add({
        type: "error",
        title: message,
      })
    } finally {
      setPending(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-2xl font-medium tracking-[-0.03em] text-white">
          {site.register.successTitle}
        </p>
        <p className="max-w-sm text-sm leading-relaxed text-white/55">
          {site.register.successDescription}
        </p>
      </div>
    )
  }

  return (
    <Questionnaire
      items={items}
      onSubmit={handleSubmit}
      // Keep HTML5 checks (email format) in addition to step validation.
      noValidate={false}
      className="gap-6"
      shortcuts="letters"
    >
      <QuestionnaireProgress className="text-white/40" />
      {site.register.questions.map((question) => (
        <QuestionnaireItem
          key={question.name}
          name={question.name}
          required={question.required}
        >
          <QuestionnaireTitle className="text-xl tracking-[-0.02em] text-white md:text-2xl">
            {question.prompt}
          </QuestionnaireTitle>
          <QuestionnaireDescription className="text-white/50">
            {question.description}
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            {question.choices.map((choice) => (
              <QuestionnaireChoice
                key={choice.value}
                value={choice.value}
                className="border-white/12 bg-white/5 text-white hover:bg-white/10 data-checked:border-white/35 data-checked:bg-white/12"
              >
                <span className="font-medium">{choice.label}</span>
                {"description" in choice && choice.description ? (
                  <QuestionnaireChoiceDescription className="text-white/45">
                    {choice.description}
                  </QuestionnaireChoiceDescription>
                ) : null}
              </QuestionnaireChoice>
            ))}
            {"input" in question && question.input ? (
              <QuestionnaireInput
                aria-label={question.input.label}
                placeholder={question.input.placeholder}
                type={
                  "type" in question.input ? question.input.type : "text"
                }
                required={question.required && question.choices.length === 0}
                autoComplete={
                  "type" in question.input && question.input.type === "email"
                    ? "email"
                    : undefined
                }
                className="border-white/12 bg-white/5 text-white placeholder:text-white/35 focus-visible:border-white/40 focus-visible:ring-white/20"
              />
            ) : null}
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
      ))}
      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}
      <QuestionnaireActions>
        <QuestionnairePrevious
          variant="outline"
          className="border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
        />
        <QuestionnaireSkip
          variant="outline"
          className="border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
        />
        <QuestionnaireNext className="bg-white text-black hover:bg-white/90" />
        <QuestionnaireSubmit
          disabled={pending}
          className="bg-white text-black hover:bg-white/90"
        >
          {pending ? "Submitting…" : site.register.submitLabel}
        </QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  )
}
