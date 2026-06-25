# Vendor Onboarding Stepper — Spec (SPAC)

**Tech stack:** TypeScript, React, Tailwind CSS  
**State:** `useState` for `currentStep` and `formData`

---

## 1. Component Tree

```
App
└── VendorOnboardingWizard
    ├── ProgressBar
    │   └── (inner fill div)
    ├── StepIndicators
    │   └── StepIndicator[] (one per step)
    ├── HelpBox
    ├── StepContent (switch by currentStep)
    │   ├── BasicInformationStep    ← step 0
    │   ├── RiskProfileStep         ← step 1
    │   ├── DocumentsStep           ← step 2
    │   └── ReviewSubmitStep        ← step 3
    └── WizardActions
        ├── BackButton
        ├── NextButton
        └── SubmitButton
```

### Step content internal structure (per step)

**BasicInformationStep**
```
BasicInformationStep
├── FormSection (company)
│   ├── Input (companyName)
│   ├── Input (registrationNumber)
│   └── Input (taxId)
├── FormSection (contact)
│   ├── Input (contactName)
│   ├── Input (email)
│   ├── Input (phone)
│   └── Input (jobTitle)
└── FormSection (address)
    ├── Input (addressLine1)
    ├── Input (addressLine2)
    ├── Input (city)
    ├── Input (state)
    └── Input (postalCode)
```

**RiskProfileStep**
```
RiskProfileStep
├── FormSection (risk)
│   ├── Select (riskCategory)
│   ├── Select (industry)
│   └── Textarea (riskNotes)
└── FormSection (compliance)
    ├── Checkbox (requiresAudit)
    └── Textarea (complianceNotes)
```

**DocumentsStep**
```
DocumentsStep
├── DocumentUpload (contract)
├── DocumentUpload (taxCertificate)
├── DocumentUpload (insurance)
└── DocumentList (uploaded items)
```

**ReviewSubmitStep**
```
ReviewSubmitStep
├── ReviewSection (Basic Information)
│   └── ReviewRow[] (key-value pairs)
├── ReviewSection (Risk Profile)
│   └── ReviewRow[]
├── ReviewSection (Documents)
│   └── DocumentChip[] or list
└── (optional) TermsCheckbox + Submit hint
```

---

## 2. Shared Types & Form Data Shape

```ts
// types/vendor.ts

export const STEP_LABELS = [
  'Basic Information',
  'Risk Profile',
  'Documents',
  'Review & Submit',
] as const;

export type StepIndex = 0 | 1 | 2 | 3;

export interface DocumentItem {
  id: string;
  type: string;       // e.g. 'contract' | 'taxCertificate' | 'insurance'
  name: string;
  file?: File;
  status: 'pending' | 'uploaded' | 'error';
}

export interface VendorOnboardingFormData {
  // Step 1: Basic Information
  companyName: string;
  registrationNumber: string;
  taxId: string;
  contactName: string;
  email: string;
  phone: string;
  jobTitle: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;

  // Step 2: Risk Profile
  riskCategory: string;
  industry: string;
  riskNotes: string;
  requiresAudit: boolean;
  complianceNotes: string;

  // Step 3: Documents
  documents: DocumentItem[];
}
```

---

## 3. Prop Lists by Component

### 3.1 VendorOnboardingWizard

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| (none – root; holds state) | | | Uses internal `useState` for `currentStep` and `formData`. Optional: `onSubmit?: (data: VendorOnboardingFormData) => void \| Promise<void>` |

**Internal state:**
- `currentStep: number` (0–3)
- `formData: VendorOnboardingFormData`
- `setCurrentStep`, `setFormData`

---

### 3.2 ProgressBar

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentStep` | `number` | Yes | 0–3 |
| `totalSteps` | `number` | Yes | 4 |
| `className?` | `string` | No | Extra Tailwind classes |

**Derived:** `progressPercent = ((currentStep + 1) / totalSteps) * 100`

---

### 3.3 StepIndicators

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `steps` | `readonly string[]` | Yes | e.g. `STEP_LABELS` |
| `currentStep` | `number` | Yes | 0–3 |
| `className?` | `string` | No | Extra Tailwind classes |

**StepIndicator (internal / map):**
- `label: string`
- `index: number`
- `isActive: boolean` — `index === currentStep`
- `isCompleted: boolean` — `index < currentStep`

---

### 3.4 HelpBox

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentStep` | `number` | Yes | 0–3 |
| `messages` | `Record<number, string>` or `string[]` | Yes | Help text per step index |
| `className?` | `string` | No | Extra Tailwind classes |

**Example messages:**
```ts
const HELP_MESSAGES: Record<number, string> = {
  0: 'Enter your company and primary contact details.',
  1: 'Select risk category and add any compliance notes.',
  2: 'Upload the required documents. All marked items are mandatory.',
  3: 'Review your information and submit to complete onboarding.',
};
```

---

### 3.5 BasicInformationStep

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `formData` | `VendorOnboardingFormData` | Yes | Current form state |
| `onChange` | `(field: keyof VendorOnboardingFormData, value: string) => void` | Yes | Update a single field (e.g. `setFormData(prev => ({ ...prev, [field]: value }))`) |
| `errors?` | `Partial<Record<keyof VendorOnboardingFormData, string>>` | No | Field-level validation errors |
| `className?` | `string` | No | Extra Tailwind classes |

**Fields used:**  
`companyName`, `registrationNumber`, `taxId`, `contactName`, `email`, `phone`, `jobTitle`, `addressLine1`, `addressLine2`, `city`, `state`, `postalCode`

---

### 3.6 RiskProfileStep

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `formData` | `VendorOnboardingFormData` | Yes | Current form state |
| `onChange` | `(field: keyof VendorOnboardingFormData, value: string \| boolean) => void` | Yes | Update a single field |
| `errors?` | `Partial<Record<keyof VendorOnboardingFormData, string>>` | No | Field-level validation errors |
| `riskOptions?` | `{ value: string; label: string }[]` | No | Options for risk category select |
| `industryOptions?` | `{ value: string; label: string }[]` | No | Options for industry select |
| `className?` | `string` | No | Extra Tailwind classes |

**Fields used:**  
`riskCategory`, `industry`, `riskNotes`, `requiresAudit`, `complianceNotes`

---

### 3.7 DocumentsStep

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `documents` | `DocumentItem[]` | Yes | From `formData.documents` |
| `onDocumentsChange` | `(documents: DocumentItem[]) => void` | Yes | Replace documents (e.g. `setFormData(prev => ({ ...prev, documents }))`) |
| `requiredTypes?` | `string[]` | No | e.g. `['contract', 'taxCertificate', 'insurance']` |
| `errors?` | `{ documents?: string }` or per-type | No | Validation errors |
| `className?` | `string` | No | Extra Tailwind classes |

**DocumentUpload (internal) props:**
- `type: string`
- `label: string`
- `document?: DocumentItem` (from `documents` matching type)
- `onUpload: (file: File) => void`
- `onRemove: () => void`
- `error?: string`

---

### 3.8 ReviewSubmitStep

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `formData` | `VendorOnboardingFormData` | Yes | Full form data for display |
| `stepLabels` | `readonly string[]` | Yes | Section titles, e.g. `STEP_LABELS` |
| `className?` | `string` | No | Extra Tailwind classes |

**ReviewSection (internal) props:**
- `title: string`
- `children: React.ReactNode` (e.g. list of `ReviewRow`)

**ReviewRow (internal) props:**
- `label: string`
- `value: string | React.ReactNode`

**Logic:** Map `formData` into three sections (Basic Info, Risk Profile, Documents) and render label/value rows; documents section can show `DocumentItem[].map(d => d.name)` or chips.

---

### 3.9 WizardActions

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentStep` | `number` | Yes | 0–3 |
| `totalSteps` | `number` | Yes | 4 |
| `onBack` | `() => void` | Yes | `setCurrentStep(prev => prev - 1)` |
| `onNext` | `() => void` | Yes | Validate current step, then `setCurrentStep(prev => prev + 1)` |
| `onSubmit` | `() => void` | Yes | Validate and call parent submit handler |
| `isNextDisabled?` | `boolean` | No | When validation fails |
| `isSubmitting?` | `boolean` | No | Disable Submit and show loading |
| `className?` | `string` | No | Extra Tailwind classes |

**Visibility:**
- **Back:** render when `currentStep > 0`
- **Next:** render when `currentStep < totalSteps - 1`
- **Submit:** render when `currentStep === totalSteps - 1`

---

## 4. Validation Contracts (for Next/Submit)

Use these in the parent (e.g. `VendorOnboardingWizard`) to set `errors` and decide `isNextDisabled` / whether to advance or submit.

**Step 0 – Basic Information**
- Required: `companyName`, `contactName`, `email`
- Format: valid email; optional phone format
- Return: `{ valid: boolean; errors?: Partial<Record<string, string>> }`

**Step 1 – Risk Profile**
- Required: `riskCategory`
- Return: `{ valid: boolean; errors?: Partial<Record<string, string>> }`

**Step 2 – Documents**
- Required: at least one document per `requiredTypes`, or minimum list (e.g. contract, taxCertificate, insurance)
- Return: `{ valid: boolean; errors?: { documents?: string } }`

**Step 3 – Review & Submit**
- Optional: re-run critical validations or require terms accepted
- Return: `{ valid: boolean }`

---

## 5. File Layout

```
src/
  components/
    VendorOnboardingWizard.tsx   # Root: state + ProgressBar + StepIndicators + HelpBox + step switch + WizardActions
    ProgressBar.tsx
    StepIndicators.tsx
    HelpBox.tsx
    WizardActions.tsx
    steps/
      BasicInformationStep.tsx
      RiskProfileStep.tsx
      DocumentsStep.tsx
      ReviewSubmitStep.tsx
    steps/inputs/                # optional
      FormSection.tsx
      ReviewSection.tsx
      ReviewRow.tsx
      DocumentUpload.tsx
  types/
    vendor.ts                    # VendorOnboardingFormData, DocumentItem, STEP_LABELS, StepIndex
  utils/
    validation.ts                # validateStep0, validateStep1, validateStep2, validateStep3
  App.tsx
```

---

## 6. Data Flow Summary

1. **VendorOnboardingWizard** owns `currentStep` and `formData` (useState).
2. **ProgressBar** and **StepIndicators** and **HelpBox** receive `currentStep` (and steps/labels/messages); read-only.
3. **Step content:** Receives `formData` and update handlers (`onChange`, `onDocumentsChange`); parent updates state.
4. **WizardActions** receives `currentStep`, `onBack`, `onNext`, `onSubmit`; parent runs validation and state updates.
5. Validation lives in `utils/validation.ts`; parent calls `validateStepN(formData)` before advancing or submitting.

This spec gives a concrete component tree and prop list for all steps and shared UI so implementation can stay consistent across the wizard.

---

## 7. TypeScript prop interfaces

Concrete prop interfaces for all components are defined in **`src/types/vendor.ts`**:

- `ProgressBarProps`
- `StepIndicatorsProps`
- `HelpBoxProps`
- `BasicInformationStepProps`
- `RiskProfileStepProps`
- `DocumentsStepProps`
- `ReviewSubmitStepProps`
- `WizardActionsProps`

Use `INITIAL_FORM_DATA` and `HELP_MESSAGES` from the same file for initial state and help box content.
