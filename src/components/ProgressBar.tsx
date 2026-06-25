import type { ProgressBarProps } from '../types/vendor'

export default function ProgressBar({
  currentStep,
  totalSteps,
  className = '',
}: ProgressBarProps) {
  const progressPercent = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div
        className="h-full rounded-full bg-indigo-600 transition-all duration-300 ease-out"
        style={{ width: `${progressPercent}%` }}
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
      />
    </div>
  )
}
