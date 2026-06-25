import type { BasicInformationStepProps } from '../../types/vendor'
import FormSection from './inputs/FormSection'

const BASIC_FIELDS = [
  { key: 'companyName' as const, label: 'Company name' },
  { key: 'registrationNumber' as const, label: 'Registration number' },
  { key: 'taxId' as const, label: 'Tax ID' },
] as const

const CONTACT_FIELDS = [
  { key: 'contactName' as const, label: 'Contact name' },
  { key: 'email' as const, label: 'Email', type: 'email' as const },
  { key: 'phone' as const, label: 'Phone', type: 'tel' as const },
  { key: 'jobTitle' as const, label: 'Job title' },
] as const

const ADDRESS_FIELDS = [
  { key: 'addressLine1' as const, label: 'Address line 1' },
  { key: 'addressLine2' as const, label: 'Address line 2' },
  { key: 'city' as const, label: 'City' },
  { key: 'state' as const, label: 'State / Province' },
  { key: 'postalCode' as const, label: 'Postal code' },
] as const

export default function BasicInformationStep({
  formData,
  onChange,
  errors = {},
  className = '',
}: BasicInformationStepProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <FormSection title="Company">
        {BASIC_FIELDS.map(({ key, label }) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              id={key}
              type="text"
              value={formData[key] ?? ''}
              onChange={(e) => onChange(key, e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors[key] && <p className="mt-1 text-sm text-red-600">{errors[key]}</p>}
          </div>
        ))}
      </FormSection>
      <FormSection title="Contact">
        {CONTACT_FIELDS.map((field) => {
          const key = field.key
          const label = field.label
          const inputType = 'type' in field ? field.type : 'text'
          return (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              id={key}
              type={inputType}
              value={formData[key] ?? ''}
              onChange={(e) => onChange(key, e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors[key] && <p className="mt-1 text-sm text-red-600">{errors[key]}</p>}
          </div>
          );
        })}
      </FormSection>
      <FormSection title="Address">
        {ADDRESS_FIELDS.map(({ key, label }) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              id={key}
              type="text"
              value={formData[key] ?? ''}
              onChange={(e) => onChange(key, e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors[key] && <p className="mt-1 text-sm text-red-600">{errors[key]}</p>}
          </div>
        ))}
      </FormSection>
    </div>
  )
}
