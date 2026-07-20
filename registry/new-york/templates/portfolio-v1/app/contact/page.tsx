import { ContactForm } from "../../components/contact-form"

export default function ContactPage() {
  return (
    <div className="typeset typeset-article max-w-[42em]">
      <h1>Contact</h1>
      <p>
        If you want to reach me about speaking, media, teaching, or a question
        about the books and notes, send a message here.
      </p>
      <div className="not-typeset mt-[calc(var(--typeset-flow)*2.4)] max-w-xl">
        <ContactForm />
      </div>
    </div>
  )
}
