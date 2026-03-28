export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="preview-embed-root bg-background text-foreground">
      <main className="w-full">{children}</main>
    </div>
  )
}
