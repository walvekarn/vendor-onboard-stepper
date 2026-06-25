import type { StepIndicatorsProps } from '../types/vendor'

export default function StepIndicators({
  steps,
  currentStep,
  className = '',
}: StepIndicatorsProps) {
  return (
    <nav aria-label="Progress" className={className}>
      <ol className="flex items-center justify-between gap-2">
        {steps.map((label, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          return (
            <li
              key={index}
              className="flex flex-1 flex-col items-center"
              aria-current={isActive ? 'step' : undefined}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                  isCompleted
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : isActive
                      ? 'border-indigo-600 bg-white text-indigo-600 ring-2 ring-indigo-600'
                      : 'border-gray-300 bg-white text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <span aria-hidden="true">✓</span>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`mt-1 text-xs font-medium ${
                  isActive ? 'text-indigo-600' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
