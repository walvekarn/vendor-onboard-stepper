# BDD Acceptance Criteria: Vendor Onboarding Stepper

Format: **Given** (context) **When** (action) **Then** (outcome).

---

## Wizard and navigation

**AC-W1**  
Given the user opens the vendor onboarding wizard  
When the page loads  
Then the wizard shows step 1 "Basic Information"  
And a progress bar reflects the first step  
And step indicators show all four steps with step 1 active  
And a help box shows guidance for step 1  
And "Next" and "Save draft" buttons are visible  
And "Back" is not visible  

**AC-W2**  
Given the user is on step 1 with required fields empty  
When the user clicks "Next"  
Then the step does not change  
And validation errors are shown for company name, contact name, and email  

**AC-W3**  
Given the user is on step 1  
And company name, contact name, and email are filled with valid values (valid email format)  
When the user clicks "Next"  
Then the wizard advances to step 2 "Risk Profile"  
And the progress bar and step indicators update  
And the help box shows guidance for step 2  
And "Back" is visible  

**AC-W4**  
Given the user is on step 2 or 3  
When the user clicks "Back"  
Then the wizard moves to the previous step  
And no validation is run  
And the progress bar and step indicators update  

**AC-W5**  
Given the user is on step 2  
And risk category is not selected  
When the user clicks "Next"  
Then the step does not change  
And a validation error is shown for risk category  

**AC-W6**  
Given the user is on step 2 with risk category selected  
When the user clicks "Next"  
Then the wizard advances to step 3 "Documents"  

**AC-W7**  
Given the user is on step 3  
And at least one required document type has no file uploaded  
When the user clicks "Next"  
Then the step does not change  
And a validation error is shown for documents  

**AC-W8**  
Given the user is on step 3 with all required document types having an uploaded file  
When the user clicks "Next"  
Then the wizard advances to step 4 "Review & Submit"  
And "Submit" is visible instead of "Next"  

---

## Save draft

**AC-D1**  
Given the user has entered some data on any step  
When the user clicks "Save draft"  
Then the current form data, current step, and user log are saved to localStorage under a defined key  
And a "draft_saved" entry is appended to the user log with timestamp and step  
And the user sees a brief saving indication (e.g. button state)  

**AC-D2**  
Given the user previously saved a draft (localStorage contains onboarding state)  
When the user opens or refreshes the wizard  
Then the wizard restores form data, current step, and user log from localStorage  
And the user sees the step they were on when they saved  

**AC-D3**  
Given the user saves a draft on step 3 with document metadata (no file binary)  
When the saved state is read from localStorage  
Then the document entries have id, type, name, and status only  
And no file binary is stored  

---

## Submit and export

**AC-S1**  
Given the user is on step 4 "Review & Submit"  
And all steps are valid (required fields and documents satisfied)  
When the user clicks "Submit"  
Then a "submitted" entry is appended to the user log with timestamp and summary payload  
And the onboarding state (form data + step + log) is persisted to localStorage  
And the wizard shows a success message  
And an "Export submitted form" button becomes visible  

**AC-S2**  
Given the user is on step 4  
And at least one prior step would fail validation (e.g. missing required field)  
When the user clicks "Submit"  
Then submit does not complete  
And the user remains on step 4 and can correct data or go back  

**AC-S3**  
Given the user has successfully submitted the form  
When the user clicks "Export submitted form"  
Then a JSON file is downloaded  
And the file contains form data (with documents as metadata only), optional user log, and submittedAt (ISO 8601)  
And the file name includes a timestamp or identifier  

---

## User log (audit)

**AC-L1**  
Given the user opens the wizard for the first time (no draft)  
When the wizard initializes  
Then the user log contains one "step_enter" entry with step 0 and a timestamp  

**AC-L2**  
Given the user is on step N and clicks "Next" (and validation passes)  
When the wizard advances to step N+1  
Then a "step_enter" entry is appended with step N+1 and timestamp  

**AC-L3**  
Given the user clicks "Back" from step N to step N-1  
When the wizard moves to the previous step  
Then a "step_enter" entry is appended with step N-1 and timestamp  

**AC-L4**  
Given the user log is persisted (draft or submit)  
When the state is read back  
Then each log entry has id, timestamp, action, and optional step and payload  
And actions are one of "step_enter", "draft_saved", "submitted"  

---

## UI and accessibility

**AC-U1**  
Given any step is visible  
When the user views the wizard  
Then a progress bar at the top shows completion proportion (e.g. (currentStep+1)/4)  
And step indicators show completed, active, and upcoming steps distinctly  

**AC-U2**  
Given any step is visible  
When the user views the wizard  
Then the help box shows the correct contextual message for that step  

**AC-U3**  
Given the user is on a step with validation errors  
When the errors are displayed  
Then each invalid field shows an associated error message  
And the user can correct the field and re-attempt "Next"  

**AC-U4**  
Given the wizard action buttons are visible  
When the user focuses or interacts with them  
Then "Back" is left-aligned (or first), "Save draft" next, and "Next" or "Submit" right-aligned  
And buttons have clear labels (Back, Save draft, Next, Submit, Export submitted form)  

---

## Validation rules (summary)

**AC-V1**  
Given step 1 (Basic Information)  
When validating for "Next"  
Then company name is required  
And contact name is required  
And email is required and must match a valid email format  

**AC-V2**  
Given step 2 (Risk Profile)  
When validating for "Next"  
Then risk category is required  

**AC-V3**  
Given step 3 (Documents)  
When validating for "Next"  
Then each required document type (e.g. contract, taxCertificate, insurance) must have at least one document with a name  

**AC-V4**  
Given step 4 (Review & Submit)  
When validating for "Submit"  
Then the same rules as steps 1–3 are applied so that the full form is valid  
