export type InterviewMode = "Online" | "Offline";

export interface InterviewSlot {
  time: string; // e.g. "09:00 AM"
  remainingSeats: number;
  totalSeats: number;
  availability: "available" | "limited" | "full" | "disabled";
}

export interface InterviewDate {
  date: string; // YYYY-MM-DD
  availability: "available" | "limited" | "full" | "disabled";
  slots: InterviewSlot[];
}

export interface CandidateDetails {
  name: string;
  applicationNumber: string;
  programApplied: string;
  email: string;
  phone: string;
}

export interface InterviewBooking {
  referenceNumber: string;
  candidateName: string;
  applicationNumber: string;
  programApplied: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g., "09:00 AM"
  timezone: string; // e.g., "IST (UTC+5:30)"
  mode: InterviewMode;
}
