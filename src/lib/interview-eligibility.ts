import { ApplicationFormView } from "@/types/application-form";

// ──────────────────────────────────────────────────────────────
// Workflow State Constants
// ──────────────────────────────────────────────────────────────

/** States where an Offer Letter has been issued by admin */
const OFFER_LETTER_ISSUED_STATES = [
  "Offer Letter Sent",
  "Offer Letter Accepted",
  "Payment Pending",
  "Enrolled",
];

/** States where the student has accepted the Offer Letter */
const OFFER_LETTER_ACCEPTED_STATES = [
  "Offer Letter Accepted",
  "Payment Pending",
  "Enrolled",
];

/** States that indicate the application has progressed beyond Draft */
const BEYOND_DRAFT_STATES = [
  "Submitted",
  "Under Review",
  "Offer Letter Sent",
  "Offer Letter Accepted",
  "Payment Pending",
  "Enrolled",
];

// ──────────────────────────────────────────────────────────────
// Individual Stage Checks
// ──────────────────────────────────────────────────────────────

/**
 * Check if the application form has been submitted.
 * Returns true if docstatus === 1 OR workflow_state has progressed beyond "Draft".
 * (In Frappe, workflow_state can advance independently of docstatus.)
 */
export function isApplicationSubmitted(
  application: ApplicationFormView | null | undefined
): boolean {
  if (!application) return false;
  return (
    application.docstatus === 1 ||
    BEYOND_DRAFT_STATES.includes(application.workflow_state || "")
  );
}

/**
 * Check if the admin has issued an Offer Letter.
 * True when workflow_state is "Offer Letter Sent" or any later state.
 */
export function isOfferLetterIssued(
  application: ApplicationFormView | null | undefined
): boolean {
  if (!application) return false;
  return OFFER_LETTER_ISSUED_STATES.includes(application.workflow_state || "");
}

/**
 * Check if the student has accepted the Offer Letter.
 * True when workflow_state is "Offer Letter Accepted" or any later state.
 */
export function isOfferLetterAccepted(
  application: ApplicationFormView | null | undefined
): boolean {
  if (!application) return false;
  return OFFER_LETTER_ACCEPTED_STATES.includes(application.workflow_state || "");
}

// ──────────────────────────────────────────────────────────────
// Composite Eligibility Checks
// ──────────────────────────────────────────────────────────────

/**
 * Checks if a student is eligible to schedule an interview.
 *
 * Eligibility conditions:
 * 1. Application has been submitted/progressed beyond Draft.
 * 2. Student has accepted the Offer Letter (workflow_state is "Offer Letter Accepted" or later).
 */
export function isInterviewEligible(
  application: ApplicationFormView | null | undefined
): boolean {
  return isApplicationSubmitted(application) && isOfferLetterAccepted(application);
}

/**
 * Checks if a student is eligible to access the Payment module.
 *
 * Eligibility conditions:
 * 1. Offer Letter accepted.
 * 2. Interview has been booked/scheduled (booking exists).
 */
export function isPaymentEligible(
  application: ApplicationFormView | null | undefined,
  interviewBooked: boolean
): boolean {
  return isOfferLetterAccepted(application) && interviewBooked;
}
