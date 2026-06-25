import { describe, it, expect } from 'vitest'
import {
  validateStep0,
  validateStep1,
  validateStep2,
  validateStep3,
} from './validation'
import type { VendorOnboardingFormData } from '../types/vendor'
import { INITIAL_FORM_DATA } from '../types/vendor'

function baseForm(overrides: Partial<VendorOnboardingFormData> = {}): VendorOnboardingFormData {
  return { ...INITIAL_FORM_DATA, ...overrides }
}

describe('validateStep0', () => {
  it('returns valid when companyName, contactName, and email are set and email is valid', () => {
    const data = baseForm({
      companyName: 'Acme Inc',
      contactName: 'Jane Doe',
      email: 'jane@example.com',
    })
    expect(validateStep0(data).valid).toBe(true)
    expect(validateStep0(data).errors).toBeUndefined()
  })

  it('returns invalid and errors when companyName is missing', () => {
    const data = baseForm({ contactName: 'Jane', email: 'jane@example.com' })
    const result = validateStep0(data)
    expect(result.valid).toBe(false)
    expect(result.errors?.companyName).toBe('Company name is required')
  })

  it('returns invalid when contactName is missing', () => {
    const data = baseForm({ companyName: 'Acme', email: 'jane@example.com' })
    const result = validateStep0(data)
    expect(result.valid).toBe(false)
    expect(result.errors?.contactName).toBe('Contact name is required')
  })

  it('returns invalid when email is missing', () => {
    const data = baseForm({ companyName: 'Acme', contactName: 'Jane' })
    const result = validateStep0(data)
    expect(result.valid).toBe(false)
    expect(result.errors?.email).toBe('Email is required')
  })

  it('returns invalid when email format is invalid', () => {
    const data = baseForm({
      companyName: 'Acme',
      contactName: 'Jane',
      email: 'not-an-email',
    })
    const result = validateStep0(data)
    expect(result.valid).toBe(false)
    expect(result.errors?.email).toBe('Enter a valid email address')
  })
})

describe('validateStep1', () => {
  it('returns valid when riskCategory is set', () => {
    const data = baseForm({ riskCategory: 'low' })
    expect(validateStep1(data).valid).toBe(true)
  })

  it('returns invalid when riskCategory is missing', () => {
    const data = baseForm({})
    const result = validateStep1(data)
    expect(result.valid).toBe(false)
    expect(result.errors?.riskCategory).toBe('Risk category is required')
  })
})

describe('validateStep2', () => {
  it('returns valid when required document types are present', () => {
    const data = baseForm({
      documents: [
        { id: '1', type: 'contract', name: 'c.pdf', status: 'uploaded' },
        { id: '2', type: 'taxCertificate', name: 't.pdf', status: 'uploaded' },
        { id: '3', type: 'insurance', name: 'i.pdf', status: 'uploaded' },
      ],
    })
    expect(validateStep2(data).valid).toBe(true)
  })

  it('returns invalid when a required document type is missing', () => {
    const data = baseForm({
      documents: [
        { id: '1', type: 'contract', name: 'c.pdf', status: 'uploaded' },
      ],
    })
    const result = validateStep2(data)
    expect(result.valid).toBe(false)
    expect(result.errors?.documents).toMatch(/taxCertificate|insurance/)
  })

  it('returns invalid when document has type but no name', () => {
    const data = baseForm({
      documents: [
        { id: '1', type: 'contract', name: '', status: 'pending' },
        { id: '2', type: 'taxCertificate', name: 't.pdf', status: 'uploaded' },
        { id: '3', type: 'insurance', name: 'i.pdf', status: 'uploaded' },
      ],
    })
    const result = validateStep2(data)
    expect(result.valid).toBe(false)
  })
})

describe('validateStep3', () => {
  it('returns valid when step0, step1, and step2 data are valid', () => {
    const data = baseForm({
      companyName: 'Acme',
      contactName: 'Jane',
      email: 'jane@example.com',
      riskCategory: 'low',
      documents: [
        { id: '1', type: 'contract', name: 'c.pdf', status: 'uploaded' },
        { id: '2', type: 'taxCertificate', name: 't.pdf', status: 'uploaded' },
        { id: '3', type: 'insurance', name: 'i.pdf', status: 'uploaded' },
      ],
    })
    expect(validateStep3(data).valid).toBe(true)
  })

  it('returns invalid when step0 data is invalid', () => {
    const data = baseForm({ companyName: 'Acme', riskCategory: 'low' })
    expect(validateStep3(data).valid).toBe(false)
  })

  it('returns invalid when step1 data is invalid', () => {
    const data = baseForm({
      companyName: 'Acme',
      contactName: 'Jane',
      email: 'jane@example.com',
      documents: [
        { id: '1', type: 'contract', name: 'c.pdf', status: 'uploaded' },
        { id: '2', type: 'taxCertificate', name: 't.pdf', status: 'uploaded' },
        { id: '3', type: 'insurance', name: 'i.pdf', status: 'uploaded' },
      ],
    })
    expect(validateStep3(data).valid).toBe(false)
  })
})
