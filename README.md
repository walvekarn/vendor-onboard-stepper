Status: Deployed demo, mock data

# Vendor Onboarding Stepper

A prototype multi-step wizard for onboarding new vendors: basic information, risk profile, documents and review, with step validation and draft saving in the browser.

**Stack:** React · TypeScript · Vite · Tailwind CSS · Vitest. Static build, no backend. Deploys to Vercel with no extra configuration.

## Project Management View

- **Business problem:** Vendor onboarding runs as back-and-forth over email and forms, so required details arrive late or incomplete.
- **User:** Internal staff onboarding new vendors, sometimes across several sessions.
- **Scope:** In: four-step wizard, client-side validation, save draft to localStorage, user activity log, JSON export after submit. Out (per `docs/PRD_VENDOR_ONBOARDING_STEPPER.md`): backend API, authentication, multi-tenancy, document storage or scanning.
- **Key requirements and decisions:** "Next" is blocked until the step is valid (company name, contact name and valid email; risk category; one file per required document type). Drafts store document metadata only, not files. Each step entry, draft save and submit is logged.
- **Acceptance criteria:** Given/When/Then scenarios in `docs/BDD_ACCEPTANCE_CRITERIA.md`.
- **What is tested:** 21 Vitest tests on step validation rules, navigation, draft save and the export button. Not tested: document upload, export file content, cross-browser behaviour.
- **Known limitations:** Submit stays in the browser; nothing is sent to a server. Uploaded files are lost on reload.
- **What production would need:** A submit API, secure document storage, authentication, and a review queue for submitted vendors.

## Problem

Vendor onboarding is usually a messy back-and-forth over email and forms. This stepper turns it into a structured wizard with validation, clear progress, inline guidance, and the ability to save and resume drafts.

## Features

- **Multi-step wizard:** Basic Information → Risk Profile → Documents → Review and Submit, with a progress bar and step indicators
- **Inline validation and guidance:** per-step help boxes and field-level validation
- **Save draft and resume:** form data and current step are saved to localStorage (document files are not)
- **Review and submit:** final summary screen before submission, then JSON export
- **Tests:** Vitest suite covering wizard navigation and validation

## Product artifacts

- `docs/PRD_VENDOR_ONBOARDING_STEPPER.md`: PRD
- `docs/BDD_ACCEPTANCE_CRITERIA.md`: Given/When/Then acceptance scenarios
- `docs/VENDOR_ONBOARDING_STEPPER_SPEC.md`: specification
- `docs/schemas/`: JSON schemas

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run test:run  # Vitest suite
npm run build     # production build to /dist
```

## Deploy

Import the repo at [vercel.com](https://vercel.com) → Deploy. Vite is auto-detected (build: `npm run build`, output: `dist`); no environment variables required.

---
Built by [Nikita Walvekar](https://www.linkedin.com/in/nikitaw3) · part of a vendor & compliance operations prototype suite.
