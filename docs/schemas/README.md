# JSON Schemas: Vendor Onboarding

## vendor-onboarding.json

Single schema that defines:

- **DocumentItem** — Serializable document metadata (id, type, name, status).
- **VendorOnboardingFormData** — Full form shape for all four steps.
- **UserLogEntry** — One audit log entry (id, timestamp, action, step?, payload?).
- **OnboardingState** — Persisted state: formData, currentStep, log.
- **ExportPayload** — Exported file content: formData, userLog?, submittedAt.

Use for:

- Validating localStorage payloads.
- Validating export JSON.
- API request/response contracts if a backend is added.

Root `oneOf` allows validating any of the three top-level shapes (form, state, or export).
