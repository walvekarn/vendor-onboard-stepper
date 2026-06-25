import type { ReactNode } from 'react'

interface ReviewRowProps {
  label: string
  value: string | ReactNode
  className?: string
}

export default function ReviewRow({ label, value, className = '' }: ReviewRowProps) {
  return (
    <div className={`flex justify-between gap-4 text-sm ${className}`}>
      <span className="text-gray-500">{label}</span>
      <span className="text-right text-gray-900">{value}</span>
    </div>
  )
}
