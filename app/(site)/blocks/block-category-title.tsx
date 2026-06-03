import { cn } from "@/lib/utils"

export function BlockCategoryTitle({
  id: _id,
  title,
  className,
}: {
  id: string
  title: string
  className?: string
}) {
  return (
    <p className={cn("text-sm font-medium", className)}>
      {title}
    </p>
  )
}
