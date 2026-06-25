# Vendor Onboarding Stepper

A guided, multi-step wizard for onboarding new vendors — capturing basic information, entity details, documents, and review in a clean, validated flow with draft-saving.

**Stack:** React · TypeScript · Vite · Tailwind CSS · Vitest. Static build — deploys to Vercel with zero configuration.

## Problem

Vendor onboarding is usually a messy back-and-forth over email and forms. This stepper turns it into a structured, validated wizard with clear progress, inline guidance, and the ability to save and resume drafts.

## Features

- **Multi-step wizard** — Basic Information → Entities/Details → Documents → Review, with a progress bar and step indicators
- **Inline validation & guidance** — per-step help boxes and field-level validation
- **Save draft & resume** — no lost progress
- **Review & submit** — final summary screen before submission
- **Tested** — Vitest suite covering wizard navigation and validation

## Product artifacts

- `docs/PRD_VENDOR_ONBOARDING_STEPPER.md` — full PRD
- `docs/BDD_ACCEPTANCE_CRITERIA.md` — Given/When/Then acceptance scenarios
- `docs/VENDOR_ONBOARDING_STEPPER_SPEC.md` — specification
- `docs/schemas/` — JSON schemas

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
