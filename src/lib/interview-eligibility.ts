import { ApplicationFormView } from "@/types/application-form";

/**
 * Checks if a student is eligible to schedule an interview.
 * 
 * Eligibility conditions:
 * 1. Application Form is successfully submitted/completed (docstatus === 1).
 * 2. Student has received an Offer Letter (workflow_state is one of "Offer Letter Sent", "Offer Letter Accepted", "Payment Pending", "Enrolled").
 */
export function isInterviewEligible(application: ApplicationFormView | null | undefined): boolean {
  if (!application) return false;

  const isSubmitted = application.docstatus === 1;

  const hasOfferLetter = [
    "Offer Letter Sent",
    "Offer Letter Accepted",
    "Payment Pending",
    "Enrolled",
  ].includes(application.workflow_state || "");

  return isSubmitted && hasOfferLetter;
}
