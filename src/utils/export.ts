import type { VendorOnboardingFormData, DocumentItem, UserLogEntry } from '../types/vendor'

/** Payload for export (no File objects) */
export interface ExportPayload {
  formData: Omit<VendorOnboardingFormData, 'documents'> & {
    documents: { id: string; type: string; name: string; status: DocumentItem['status'] }[]
  }
  userLog?: UserLogEntry[]
  submittedAt: string
}

export function exportSubmittedForm(
  formData: VendorOnboardingFormData,
  userLog?: UserLogEntry[]
): void {
  const payload: ExportPayload = {
    formData: {
      ...formData,
      documents: formData.documents.map((d) => ({
        id: d.id,
        type: d.type,
        name: d.name,
        status: d.status,
      })),
    },
    ...(userLog?.length && { userLog }),
    submittedAt: new Date().toISOString(),
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vendor-onboarding-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}
