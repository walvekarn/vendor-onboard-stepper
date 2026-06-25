import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { INITIAL_FORM_DATA } from '../types/vendor'
import VendorOnboardingWizard from './VendorOnboardingWizard'

function typeInto(label: RegExp | string, value: string) {
  const el = screen.getByLabelText(label)
  fireEvent.change(el, { target: { value } })
}

describe('VendorOnboardingWizard', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})
  })

  it('renders and shows step 0 (Basic Information)', () => {
    render(<VendorOnboardingWizard />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText('Basic Information')).toBeInTheDocument()
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('does not advance when Next is clicked with empty required fields and shows errors', () => {
    render(<VendorOnboardingWizard />)
    const next = screen.getByRole('button', { name: /next/i })
    fireEvent.click(next)
    expect(screen.getByText(/company name is required/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/company name/i)).toBeInTheDocument()
  })

  it('advances to step 1 when required fields are filled and Next is clicked', () => {
    render(<VendorOnboardingWizard />)
    typeInto(/company name/i, 'Acme Inc')
    typeInto(/contact name/i, 'Jane Doe')
    typeInto(/email/i, 'jane@example.com')
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByLabelText(/risk category/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
  })

  it('Back button returns to previous step', () => {
    render(<VendorOnboardingWizard />)
    typeInto(/company name/i, 'Acme')
    typeInto(/contact name/i, 'Jane')
    typeInto(/email/i, 'jane@example.com')
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    fireEvent.change(screen.getByLabelText(/risk category/i), { target: { value: 'low' } })
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText(/contract/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByLabelText(/risk category/i)).toBeInTheDocument()
  })

  it('Save draft button is present', () => {
    render(<VendorOnboardingWizard />)
    expect(screen.getByRole('button', { name: /save draft/i })).toBeInTheDocument()
  })

  it('persists state to localStorage when Save draft is clicked', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    render(<VendorOnboardingWizard />)
    typeInto(/company name/i, 'Acme')
    fireEvent.click(screen.getByRole('button', { name: /save draft/i }))
    expect(setItem).toHaveBeenCalledWith(
      'vendor_onboarding_state',
      expect.stringContaining('"companyName":"Acme"')
    )
  })

  it('shows Submit on last step when step 3 is reached', () => {
    const stateAtStep3 = {
      formData: {
        ...INITIAL_FORM_DATA,
        companyName: 'Acme',
        contactName: 'Jane',
        email: 'jane@example.com',
        riskCategory: 'low',
        documents: [
          { id: '1', type: 'contract', name: 'c.pdf', status: 'uploaded' as const },
          { id: '2', type: 'taxCertificate', name: 't.pdf', status: 'uploaded' as const },
          { id: '3', type: 'insurance', name: 'i.pdf', status: 'uploaded' as const },
        ],
      },
      currentStep: 3,
      log: [],
    }
    vi.mocked(Storage.prototype.getItem).mockReturnValue(JSON.stringify(stateAtStep3))
    render(<VendorOnboardingWizard />)
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('shows Export button after successful submit when state was preloaded with valid data', () => {
    const validState = {
      formData: {
        ...INITIAL_FORM_DATA,
        companyName: 'Acme',
        contactName: 'Jane',
        email: 'jane@example.com',
        riskCategory: 'low',
        documents: [
          { id: '1', type: 'contract', name: 'c.pdf', status: 'uploaded' as const },
          { id: '2', type: 'taxCertificate', name: 't.pdf', status: 'uploaded' as const },
          { id: '3', type: 'insurance', name: 'i.pdf', status: 'uploaded' as const },
        ],
      },
      currentStep: 3,
      log: [],
    }
    vi.mocked(Storage.prototype.getItem).mockReturnValue(JSON.stringify(validState))
    render(<VendorOnboardingWizard />)
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText(/submitted successfully/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export submitted form/i })).toBeInTheDocument()
  })
})
