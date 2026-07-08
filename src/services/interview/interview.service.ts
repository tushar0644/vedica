import axios from "axios";
import { InterviewBooking, InterviewDate, InterviewSlot } from "@/types/interview";

export const interviewService = {
  getInterviewStatus: async (): Promise<InterviewBooking | null> => {
    const res = await axios.get<{ success: boolean; booking: InterviewBooking | null }>(
      "/api/v1/interview/status"
    );
    return res.data.booking;
  },

  getAvailableDates: async (): Promise<InterviewDate[]> => {
    const res = await axios.get<{ success: boolean; dates: InterviewDate[] }>(
      "/api/v1/interview/dates"
    );
    return res.data.dates;
  },

  getAvailableSlots: async (
    date: string
  ): Promise<{ slots: InterviewSlot[]; availability: string }> => {
    const res = await axios.get<{
      success: boolean;
      slots: InterviewSlot[];
      availability: string;
    }>("/api/v1/interview/slots", {
      params: { date },
    });
    return { slots: res.data.slots, availability: res.data.availability };
  },

  bookInterview: async (payload: {
    date: string;
    time: string;
    mode: "Online" | "Offline";
    candidateName: string;
    applicationNumber?: string;
    programApplied?: string;
    phone?: string;
  }): Promise<InterviewBooking> => {
    const res = await axios.post<{ success: boolean; booking: InterviewBooking; message?: string }>(
      "/api/v1/interview/book",
      payload
    );
    return res.data.booking;
  },

  rescheduleInterview: async (payload: {
    date: string;
    time: string;
    mode: "Online" | "Offline";
    candidateName: string;
    applicationNumber?: string;
    programApplied?: string;
    phone?: string;
  }): Promise<InterviewBooking> => {
    const res = await axios.put<{ success: boolean; booking: InterviewBooking; message?: string }>(
      "/api/v1/interview/reschedule",
      payload
    );
    return res.data.booking;
  },

  cancelInterview: async (): Promise<boolean> => {
    const res = await axios.delete<{ success: boolean; message?: string }>(
      "/api/v1/interview/cancel"
    );
    return res.data.success;
  },
};
