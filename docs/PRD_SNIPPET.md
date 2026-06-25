# PRD Snippet: Vendor Onboarding Stepper

**Product:** Vendor Onboarding Stepper  
**Type:** Multi-step wizard (4 steps)

---

## One-liner

A 4-step React/TypeScript wizard that collects vendor info (basic details, risk profile, documents), validates per step, supports save-draft and user log, and allows export of the submitted form as JSON.

---

## Steps

| # | Step              | Required for Next              | Key fields / actions                          |
|---|-------------------|--------------------------------|-----------------------------------------------|
| 1 | Basic Information | companyName, contactName, email (valid) | Company, contact, address sections            |
| 2 | Risk Profile      | riskCategory                   | Risk category, industry, notes, audit flag   |
| 3 | Documents         | One file per required type     | Contract, tax certificate, insurance         |
| 4 | Review & Submit   | Full form valid                | Read-only review; Submit; then Export button  |

---

## Actions

- **Back** — Previous step (no validation).  
- **Next** — Validate current step; advance and log.  
- **Save draft** — Persist form + step + log to localStorage; log `draft_saved`.  
- **Submit** — Validate all; persist and log `submitted`; show Export.  
- **Export** — Download JSON (form + log + submittedAt) after submit.

---

## Tech

- React, TypeScript, Tailwind, useState.  
- Validation per step; errors shown inline.  
- User log: `step_enter`, `draft_saved`, `submitted`.

---

## Out of scope (MVP)

Backend, auth, document storage, virus scan.
