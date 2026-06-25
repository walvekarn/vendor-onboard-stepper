import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export default function FormSection({ title, children, className = '' }: FormSectionProps) {
  return (
    <fieldset className={`space-y-3 ${className}`}>
      <legend className="text-sm font-semibold text-gray-900">{title}</legend>
      <div className="space-y-3">{children}</div>
    </fieldset>
  )
}
