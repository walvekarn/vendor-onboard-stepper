# Product Requirements Document: Vendor Onboarding Stepper

**Version:** 1.0  
**Last updated:** 2025-03-05  
**Status:** Approved

---

## 1. Overview

### 1.1 Purpose

The Vendor Onboarding Stepper is a multi-step wizard that guides users through collecting and submitting vendor information. It ensures structured data capture, validation, draft persistence, and an audit trail of user actions.

### 1.2 Scope

- **In scope:** Four-step wizard (Basic Information, Risk Profile, Documents, Review & Submit), client-side validation, save draft to localStorage, user activity log, export of submitted form as JSON.
- **Out of scope:** Backend API integration, authentication, multi-tenancy, document virus scanning or storage beyond browser.

### 1.3 Target Users

- Internal staff onboarding new vendors.
- Users who may need to complete onboarding in multiple sessions (draft support).

---

## 2. Goals and Success Criteria

| Goal | Success Criteria |
|------|------------------|
| Reduce errors in vendor data | Required fields enforced; email format validated. |
| Support partial completion | Draft saved to localStorage; user can resume. |
| Transparency and compliance | User log records step entry, draft save, and submit. |
| Portability of submitted data | User can export submitted form as JSON. |

---

## 3. Functional Requirements

### 3.1 Step 1: Basic Information

- **Company:** Company name (required), Registration number, Tax ID.
- **Contact:** Contact name (required), Email (required, valid format), Phone, Job title.
- **Address:** Address line 1, Address line 2, City, State/Province, Postal code.
- Validation blocks “Next” until company name, contact name, and valid email are provided.

### 3.2 Step 2: Risk Profile

- **Risk:** Risk category (required; e.g. Low/Medium/High), Industry, Risk notes (textarea).
- **Compliance:** Requires audit (checkbox), Compliance notes (textarea).
- Validation blocks “Next” until risk category is selected.

### 3.3 Step 3: Documents

- Required document types: Contract, Tax certificate, Insurance (or configurable list).
- Each type: file upload and remove; at least one file per required type for validation.
- Validation blocks “Next” until all required document types have an uploaded file.

### 3.4 Step 4: Review & Submit

- Read-only summary of all entered data in three sections (Basic Information, Risk Profile, Documents).
- **Submit:** Validates all steps; on success, records “submitted” in user log and shows success state.
- **Export submitted form:** Button visible only after successful submit; downloads JSON (form data + optional user log + submittedAt).

### 3.5 Navigation and Actions

- **Back:** Always available when step > 0; no validation; decrements step and logs step entry.
- **Next:** Available on steps 0–2; runs step validation; on success, advances step and logs step entry.
- **Save draft:** Saves current form data, current step, and full user log to localStorage (key: `vendor_onboarding_state`). Log entry “draft_saved” appended. Document files are not stored; only document metadata (id, type, name, status).
- **Submit:** Available on step 3; runs full validation; on success, appends “submitted” log entry, persists state to localStorage, sets “submitted” flag so Export button is shown.

### 3.6 User Log (Audit)

- **Actions recorded:** `step_enter` (with step index), `draft_saved` (with step), `submitted` (with summary payload).
- Each entry: id, timestamp (ISO 8601), action, optional step, optional payload.
- Log is stored in memory and included in OnboardingState when saving draft or submit; persisted to localStorage with state.

### 3.7 Persistence and Export

- **Draft:** On “Save draft,” persist serializable OnboardingState (formData without File objects) to localStorage. On load, if state exists, restore formData, currentStep, and log.
- **Export:** After submit, user can download a JSON file containing form data (documents as metadata only), user log, and submittedAt timestamp.

---

## 4. Non-Functional Requirements

### 4.1 Tech Stack

- **Frontend:** React 18+, TypeScript, Tailwind CSS.
- **State:** React useState for currentStep, formData, errors, userLog, and UI flags (e.g. isSubmitting, submitted).

### 4.2 UI/UX

- Progress bar at top reflecting current step (e.g. (currentStep+1)/totalSteps * 100%).
- Step indicators with labels; clear visual state for completed, active, and upcoming steps.
- Help box with contextual message per step.
- Single row of actions: Back (when step > 0), Save draft, Next or Submit (right-aligned).
- Clean, wizard-style layout; accessible labels and error messages.

### 4.3 Validation

- Step 0: companyName, contactName, email required; email format.
- Step 1: riskCategory required.
- Step 2: all required document types must have an uploaded document (by type/name).
- Step 3: re-validate critical fields (or full form) before submit.

### 4.4 Browser Support

- Modern browsers with localStorage and ES2020 support (e.g. Chrome, Firefox, Safari, Edge).

---

## 5. Data Model Summary

- **VendorOnboardingFormData:** All form fields (company, contact, address, risk, compliance, documents array).
- **DocumentItem:** id, type, name, file (optional; not persisted), status.
- **OnboardingState:** formData (serializable), currentStep, log (UserLogEntry[]).
- **UserLogEntry:** id, timestamp, action, step?, payload?.

---

## 6. Dependencies and Assumptions

- No backend required for MVP; all state is client-side and localStorage.
- Document “upload” is client-side only (file object in memory); export and draft store only document metadata.
- Product owner approves step order, required fields, and required document types.

---

## 7. Open Questions / Future Work

- Backend API for submit and document upload.
- Optional “Activity” or “Log” panel in UI for transparency.
- Optional terms-and-conditions checkbox on Review step.
