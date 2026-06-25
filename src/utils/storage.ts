import type { VendorOnboardingFormData, DocumentItem, OnboardingState, UserLogEntry } from '../types/vendor'

/** Form data safe for JSON (documents without File) */
export interface SerializableFormData extends Omit<VendorOnboardingFormData, 'documents'> {
  documents: { id: string; type: string; name: string; status: DocumentItem['status'] }[]
}

function toSerializableFormData(data: VendorOnboardingFormData): SerializableFormData {
  return {
    ...data,
    documents: data.documents.map((d) => ({ id: d.id, type: d.type, name: d.name, status: d.status })),
  }
}

function fromSerializableFormData(data: SerializableFormData): VendorOnboardingFormData {
  return {
    ...data,
    documents: data.documents.map((d) => ({ ...d, file: undefined })),
  }
}

const STORAGE_KEY = 'vendor_onboarding_state'

export function saveOnboardingState(state: {
  formData: VendorOnboardingFormData
  currentStep: number
  log: UserLogEntry[]
}): void {
  const serializable = {
    formData: toSerializableFormData(state.formData),
    currentStep: state.currentStep,
    log: state.log,
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable))
  } catch {
    // ignore quota / disabled localStorage
  }
}

export function loadOnboardingState(): OnboardingState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as {
      formData: SerializableFormData
      currentStep: number
      log: UserLogEntry[]
    }
    return {
      formData: fromSerializableFormData(parsed.formData),
      currentStep: parsed.currentStep,
      log: Array.isArray(parsed.log) ? parsed.log : [],
    }
  } catch {
    return null
  }
}
