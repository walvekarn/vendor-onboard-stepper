import type { ReviewSubmitStepProps } from '../../types/vendor'
import ReviewSection from './inputs/ReviewSection'
import ReviewRow from './inputs/ReviewRow'

export default function ReviewSubmitStep({
  formData,
  stepLabels,
  className = '',
}: ReviewSubmitStepProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <ReviewSection title={stepLabels[0] ?? 'Basic Information'}>
        <ReviewRow label="Company name" value={formData.companyName || '—'} />
        <ReviewRow label="Registration number" value={formData.registrationNumber || '—'} />
        <ReviewRow label="Tax ID" value={formData.taxId || '—'} />
        <ReviewRow label="Contact name" value={formData.contactName || '—'} />
        <ReviewRow label="Email" value={formData.email || '—'} />
        <ReviewRow label="Phone" value={formData.phone || '—'} />
        <ReviewRow label="Job title" value={formData.jobTitle || '—'} />
        <ReviewRow
          label="Address"
          value={
            [formData.addressLine1, formData.addressLine2, formData.city, formData.state, formData.postalCode]
              .filter(Boolean)
              .join(', ') || '—'
          }
        />
      </ReviewSection>
      <ReviewSection title={stepLabels[1] ?? 'Risk Profile'}>
        <ReviewRow label="Risk category" value={formData.riskCategory || '—'} />
        <ReviewRow label="Industry" value={formData.industry || '—'} />
        <ReviewRow label="Requires audit" value={formData.requiresAudit ? 'Yes' : 'No'} />
        <ReviewRow label="Risk notes" value={formData.riskNotes || '—'} />
        <ReviewRow label="Compliance notes" value={formData.complianceNotes || '—'} />
      </ReviewSection>
      <ReviewSection title={stepLabels[2] ?? 'Documents'}>
        {formData.documents?.length
          ? formData.documents.map((d) => (
              <ReviewRow key={d.id} label={d.type} value={d.name || 'Not uploaded'} />
            ))
          : <ReviewRow label="Documents" value="None uploaded" />}
      </ReviewSection>
    </div>
  )
}
