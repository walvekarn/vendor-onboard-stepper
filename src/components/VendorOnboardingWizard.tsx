import { useState, useCallback } from 'react'
import {
  STEP_LABELS,
  HELP_MESSAGES,
  INITIAL_FORM_DATA,
  type VendorOnboardingFormData,
  type UserLogEntry,
  type UserLogAction,
} from '../types/vendor'
import { validateStep0, validateStep1, validateStep2, validateStep3 } from '../utils/validation'
import { saveOnboardingState, loadOnboardingState } from '../utils/storage'
import { exportSubmittedForm } from '../utils/export'
import ProgressBar from './ProgressBar'
import StepIndicators from './StepIndicators'
import HelpBox from './HelpBox'
import WizardActions from './WizardActions'
import BasicInformationStep from './steps/BasicInformationStep'
import RiskProfileStep from './steps/RiskProfileStep'
import DocumentsStep from './steps/DocumentsStep'
import ReviewSubmitStep from './steps/ReviewSubmitStep'

const TOTAL_STEPS = 4

function createLogEntry(
  action: UserLogAction,
  step?: number,
  payload?: Record<string, unknown>
): UserLogEntry {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    ...(step !== undefined && { step }),
    ...(payload && { payload }),
  }
}

function getInitialState(): {
  formData: VendorOnboardingFormData
  currentStep: number
  userLog: UserLogEntry[]
} {
  const saved = loadOnboardingState()
  if (saved) {
    return {
      formData: saved.formData,
      currentStep: saved.currentStep >= 0 && saved.currentStep < TOTAL_STEPS ? saved.currentStep : 0,
      userLog: saved.log?.length ? saved.log : [createLogEntry('step_enter', saved.currentStep)],
    }
  }
  return {
    formData: INITIAL_FORM_DATA,
    currentStep: 0,
    userLog: [createLogEntry('step_enter', 0)],
  }
}

export default function VendorOnboardingWizard() {
  const initialState = getInitialState()
  const [currentStep, setCurrentStep] = useState(initialState.currentStep)
  const [formData, setFormData] = useState<VendorOnboardingFormData>(initialState.formData)
  const [userLog, setUserLog] = useState<UserLogEntry[]>(initialState.userLog)
  const [errors, setErrors] = useState<Partial<Record<keyof VendorOnboardingFormData, string>> & { documents?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const addLogEntry = useCallback((entry: UserLogEntry) => {
    setUserLog((prev) => [...prev, entry])
  }, [])

  const handleNext = useCallback(() => {
    if (currentStep === 0) {
      const result = validateStep0(formData)
      if (!result.valid) {
        setErrors(result.errors ?? {})
        return
      }
    } else if (currentStep === 1) {
      const result = validateStep1(formData)
      if (!result.valid) {
        setErrors(result.errors ?? {})
        return
      }
    } else if (currentStep === 2) {
      const result = validateStep2(formData)
      if (!result.valid) {
        setErrors(result.errors ?? {})
        return
      }
    }
    setErrors({})
    const next = currentStep + 1
    setCurrentStep(next)
    addLogEntry(createLogEntry('step_enter', next))
  }, [currentStep, formData, addLogEntry])

  const handleBack = useCallback(() => {
    setErrors({})
    const prev = currentStep - 1
    setCurrentStep(prev)
    addLogEntry(createLogEntry('step_enter', prev))
  }, [currentStep, addLogEntry])

  const handleSaveDraft = useCallback(() => {
    setIsSavingDraft(true)
    const entry = createLogEntry('draft_saved', currentStep, { currentStep })
    addLogEntry(entry)
    const nextLog = [...userLog, entry]
    saveOnboardingState({ formData, currentStep, log: nextLog })
    setUserLog(nextLog)
    setTimeout(() => setIsSavingDraft(false), 300)
  }, [currentStep, formData, userLog, addLogEntry])

  const handleSubmit = useCallback(() => {
    const result = validateStep3(formData)
    if (!result.valid) {
      setErrors({})
      return
    }
    setIsSubmitting(true)
    const entry = createLogEntry('submitted', currentStep, {
      companyName: formData.companyName,
      submittedAt: new Date().toISOString(),
    })
    addLogEntry(entry)
    const nextLog = [...userLog, entry]
    saveOnboardingState({ formData, currentStep, log: nextLog })
    setUserLog(nextLog)
    setSubmitted(true)
    setIsSubmitting(false)
  }, [currentStep, formData, userLog, addLogEntry])

  const handleFieldChange = useCallback(
    (field: keyof VendorOnboardingFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleDocumentsChange = useCallback((documents: VendorOnboardingFormData['documents']) => {
    setFormData((prev) => ({ ...prev, documents }))
  }, [])

  const handleExport = useCallback(() => {
    exportSubmittedForm(formData, userLog)
  }, [formData, userLog])

  const isNextDisabled = false

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} className="mb-6" />
      <StepIndicators steps={STEP_LABELS} currentStep={currentStep} className="mb-6" />
      <HelpBox currentStep={currentStep} messages={HELP_MESSAGES} className="mb-6" />

      <div className="min-h-[280px]">
        {currentStep === 0 && (
          <BasicInformationStep
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />
        )}
        {currentStep === 1 && (
          <RiskProfileStep
            formData={formData}
            onChange={handleFieldChange}
            errors={errors}
          />
        )}
        {currentStep === 2 && (
          <DocumentsStep
            documents={formData.documents}
            onDocumentsChange={handleDocumentsChange}
            requiredTypes={['contract', 'taxCertificate', 'insurance']}
            errors={errors}
          />
        )}
        {currentStep === 3 && (
          <ReviewSubmitStep formData={formData} stepLabels={STEP_LABELS} />
        )}
      </div>

      <WizardActions
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        onSaveDraft={handleSaveDraft}
        isNextDisabled={isNextDisabled}
        isSubmitting={isSubmitting}
        isSavingDraft={isSavingDraft}
      />

      {submitted && (
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-6">
          <p className="text-sm font-medium text-green-700">Onboarding submitted successfully.</p>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Export submitted form
          </button>
        </div>
      )}
    </div>
  )
}
