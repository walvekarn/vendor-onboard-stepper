import type { HelpBoxProps } from '../types/vendor'

export default function HelpBox({
  currentStep,
  messages,
  className = '',
}: HelpBoxProps) {
  const message =
    typeof messages === 'object' && !Array.isArray(messages)
      ? messages[currentStep]
      : Array.isArray(messages)
        ? messages[currentStep]
        : ''
  return (
    <div
      className={`rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 ${className}`}
      role="status"
    >
      <span className="font-medium">Tip: </span>
      {message}
    </div>
  )
}
