import type { RiskProfileStepProps } from '../../types/vendor'
import FormSection from './inputs/FormSection'

const DEFAULT_RISK_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const DEFAULT_INDUSTRY_OPTIONS = [
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'services', label: 'Services' },
  { value: 'technology', label: 'Technology' },
  { value: 'other', label: 'Other' },
]

export default function RiskProfileStep({
  formData,
  onChange,
  errors = {},
  riskOptions = DEFAULT_RISK_OPTIONS,
  industryOptions = DEFAULT_INDUSTRY_OPTIONS,
  className = '',
}: RiskProfileStepProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <FormSection title="Risk">
        <div>
          <label htmlFor="riskCategory" className="block text-sm font-medium text-gray-700">
            Risk category
          </label>
          <select
            id="riskCategory"
            value={formData.riskCategory ?? ''}
            onChange={(e) => onChange('riskCategory', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select…</option>
            {riskOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.riskCategory && (
            <p className="mt-1 text-sm text-red-600">{errors.riskCategory}</p>
          )}
        </div>
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
            Industry
          </label>
          <select
            id="industry"
            value={formData.industry ?? ''}
            onChange={(e) => onChange('industry', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select…</option>
            {industryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="riskNotes" className="block text-sm font-medium text-gray-700">
            Risk notes
          </label>
          <textarea
            id="riskNotes"
            rows={3}
            value={formData.riskNotes ?? ''}
            onChange={(e) => onChange('riskNotes', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </FormSection>
      <FormSection title="Compliance">
        <div className="flex items-center gap-2">
          <input
            id="requiresAudit"
            type="checkbox"
            checked={formData.requiresAudit ?? false}
            onChange={(e) => onChange('requiresAudit', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="requiresAudit" className="text-sm font-medium text-gray-700">
            Requires audit
          </label>
        </div>
        <div>
          <label htmlFor="complianceNotes" className="block text-sm font-medium text-gray-700">
            Compliance notes
          </label>
          <textarea
            id="complianceNotes"
            rows={3}
            value={formData.complianceNotes ?? ''}
            onChange={(e) => onChange('complianceNotes', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </FormSection>
    </div>
  )
}
