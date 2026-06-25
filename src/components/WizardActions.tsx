import type { WizardActionsProps } from '../types/vendor'

export default function WizardActions({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  onSaveDraft,
  isNextDisabled = false,
  isSubmitting = false,
  isSavingDraft = false,
  className = '',
}: WizardActionsProps) {
  const isLastStep = currentStep === totalSteps - 1
  const showBack = currentStep > 0
  const showNext = !isLastStep
  const showSubmit = isLastStep

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 pt-6 ${className}`}>
      <div className="flex flex-1 items-center gap-2">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back
          </button>
        )}
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSavingDraft}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSavingDraft ? 'Saving…' : 'Save draft'}
          </button>
        )}
      </div>
      <div className="flex shrink-0">
        {showNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Next
          </button>
        )}
        {showSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  )
}
