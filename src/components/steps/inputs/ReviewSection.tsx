import type { ReactNode } from 'react'

interface ReviewSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export default function ReviewSection({ title, children, className = '' }: ReviewSectionProps) {
  return (
    <div className={className}>
      <h3 className="mb-2 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  )
}
