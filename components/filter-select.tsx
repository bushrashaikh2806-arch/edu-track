"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const ALL = "all"

export function FilterSelect({
  value,
  onValueChange,
  placeholder,
  allLabel = "All",
  options,
  className = "w-full sm:w-40",
}: {
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  allLabel?: string
  options: string[]
  className?: string
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger size="default" className={className} aria-label={placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{allLabel}</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
