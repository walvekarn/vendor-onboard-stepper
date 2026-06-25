/**
 * Shared types for Vendor Onboarding Stepper.
 * Aligns with docs/VENDOR_ONBOARDING_STEPPER_SPEC.md
 */

export const STEP_LABELS = [
  'Basic Information',
  'Risk Profile',
  'Documents',
  'Review & Submit',
] as const;

export type StepIndex = 0 | 1 | 2 | 3;

export type UserLogAction = 'step_enter' | 'draft_saved' | 'submitted';

export interface UserLogEntry {
  id: string;
  timestamp: string;
  action: UserLogAction;
  step?: number;
  payload?: Record<string, unknown>;
}

export interface OnboardingState {
  formData: VendorOnboardingFormData;
  currentStep: number;
  log: UserLogEntry[];
}

export const HELP_MESSAGES: Record<number, string> = {
  0: 'Enter your company and primary contact details.',
  1: 'Select risk category and add any compliance notes.',
  2: 'Upload the required documents. All marked items are mandatory.',
  3: 'Review your information and submit to complete onboarding.',
};

export interface DocumentItem {
  id: string;
  type: string;
  name: string;
  file?: File;
  status: 'pending' | 'uploaded' | 'error';
}

export interface VendorOnboardingFormData {
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
  riskCategory: string;
  industry: string;
  riskNotes: string;
  requiresAudit: boolean;
  complianceNotes: string;
  documents: DocumentItem[];
}

/** Default empty form for useState initial value */
export const INITIAL_FORM_DATA: VendorOnboardingFormData = {
  companyName: '',
  registrationNumber: '',
  taxId: '',
  contactName: '',
  email: '',
  phone: '',
  jobTitle: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  riskCategory: '',
  industry: '',
  riskNotes: '',
  requiresAudit: false,
  complianceNotes: '',
  documents: [],
};

// --- Component prop types (concrete prop list for all steps) ---

export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export interface StepIndicatorsProps {
  steps: readonly string[];
  currentStep: number;
  className?: string;
}

export interface HelpBoxProps {
  currentStep: number;
  messages: Record<number, string> | string[];
  className?: string;
}

export interface BasicInformationStepProps {
  formData: VendorOnboardingFormData;
  onChange: (field: keyof VendorOnboardingFormData, value: string) => void;
  errors?: Partial<Record<keyof VendorOnboardingFormData, string>>;
  className?: string;
}

export interface RiskProfileStepProps {
  formData: VendorOnboardingFormData;
  onChange: (field: keyof VendorOnboardingFormData, value: string | boolean) => void;
  errors?: Partial<Record<keyof VendorOnboardingFormData, string>>;
  riskOptions?: { value: string; label: string }[];
  industryOptions?: { value: string; label: string }[];
  className?: string;
}

export interface DocumentsStepProps {
  documents: DocumentItem[];
  onDocumentsChange: (documents: DocumentItem[]) => void;
  requiredTypes?: string[];
  errors?: { documents?: string };
  className?: string;
}

export interface ReviewSubmitStepProps {
  formData: VendorOnboardingFormData;
  stepLabels: readonly string[];
  className?: string;
}

export interface WizardActionsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onSaveDraft?: () => void;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
  isSavingDraft?: boolean;
  className?: string;
}
