import type { VendorOnboardingFormData, DocumentItem } from '../types/vendor'

export interface Step0Result {
  valid: boolean
  errors?: Partial<Record<keyof VendorOnboardingFormData, string>>
}

export interface Step2Result {
  valid: boolean
  errors?: { documents?: string }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateStep0(data: VendorOnboardingFormData): Step0Result {
  const errors: Partial<Record<keyof VendorOnboardingFormData, string>> = {}
  if (!data.companyName?.trim()) errors.companyName = 'Company name is required'
  if (!data.contactName?.trim()) errors.contactName = 'Contact name is required'
  if (!data.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  }
}

export function validateStep1(data: VendorOnboardingFormData): Step0Result {
  const errors: Partial<Record<keyof VendorOnboardingFormData, string>> = {}
  if (!data.riskCategory?.trim()) errors.riskCategory = 'Risk category is required'
  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  }
}

const DEFAULT_REQUIRED_DOC_TYPES = ['contract', 'taxCertificate', 'insurance']

export function validateStep2(
  data: VendorOnboardingFormData,
  requiredTypes: string[] = DEFAULT_REQUIRED_DOC_TYPES
): Step2Result {
  const byType = new Map<string, DocumentItem>()
  for (const doc of data.documents ?? []) {
    if (doc.type && !byType.has(doc.type)) byType.set(doc.type, doc)
  }
  const missing = requiredTypes.filter((t) => !byType.has(t) || !byType.get(t)?.name)
  if (missing.length > 0) {
    return {
      valid: false,
      errors: { documents: `Required documents missing: ${missing.join(', ')}` },
    }
  }
  return { valid: true }
}

export function validateStep3(data: VendorOnboardingFormData): { valid: boolean } {
  const step0 = validateStep0(data)
  const step1 = validateStep1(data)
  const step2 = validateStep2(data)
  if (!step0.valid || !step1.valid || !step2.valid) return { valid: false }
  return { valid: true }
}

export type ValidatorStep = 0 | 1 | 2 | 3

export function getValidator(step: number) {
  switch (step) {
    case 0:
      return validateStep0
    case 1:
      return validateStep1
    case 2:
      return (data: VendorOnboardingFormData) => validateStep2(data)
    case 3:
      return validateStep3
    default:
      return () => ({ valid: true as const })
  }
}
