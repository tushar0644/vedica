"use client";

import React from "react";
import { CheckCircle2, Calendar, Clock, Video, Tag, Download, CalendarRange, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InterviewBooking } from "@/types/interview";
import Link from "next/link";

interface SuccessViewProps {
  booking: InterviewBooking;
  onReschedule: () => void;
}

export default function SuccessView({ booking, onReschedule }: SuccessViewProps) {
  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownloadConfirmation = () => {
    // Generate text-based receipt confirmation
    const content = `
=============================================
         VEDICA SCHOLARS PROGRAMME
       INTERVIEW BOOKING CONFIRMATION
=============================================

Candidate Name    : ${booking.candidateName}
Application No    : ${booking.applicationNumber}
Program Applied   : ${booking.programApplied}
Email Address     : ${booking.email}
Phone Number      : ${booking.phone}

---------------------------------------------
Appointment Details:
---------------------------------------------
Date              : ${formattedDate}
Time              : ${booking.time}
Timezone          : ${booking.timezone}
Interview Mode    : ${booking.mode}
Reference Number  : ${booking.referenceNumber}

Please log in to your student dashboard for
any rescheduling or cancellation requests.
=============================================
Thank you,
Admissions Team
Vedica Scholars Programme
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Interview_Confirmation_${booking.referenceNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center gap-6 p-4">
      {/* Visual confirmation splash */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-20 scale-150" />
          <CheckCircle2 className="w-16 h-16 text-green-500 relative z-10 animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-2">Interview Scheduled!</h2>
        <p className="text-sm text-gray-500 max-w-sm">
          Your interview has been booked successfully. A confirmation email and calendar invite have been sent.
        </p>
      </div>

      {/* Ticket Wrapper */}
      <div className="w-full bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden relative">
        {/* Ticket Header */}
        <div className="bg-maroon p-5 text-white flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-200 font-bold uppercase tracking-wider">Reference No</span>
            <span className="text-lg font-mono font-bold tracking-wide">{booking.referenceNumber}</span>
          </div>
          <span className="bg-white/10 text-white border border-white/20 text-xs px-3 py-1 rounded-full font-semibold">
            Confirmed
          </span>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-6">
          {/* Main Appointment details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3 items-start">
              <div className="p-2 bg-gray-50 text-maroon rounded-lg shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</span>
                <span className="text-sm font-bold text-gray-800">{formattedDate}</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2 bg-gray-50 text-maroon rounded-lg shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</span>
                <span className="text-sm font-bold text-gray-800">{booking.time} <span className="text-[10px] text-gray-500 font-normal">({booking.timezone})</span></span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2 bg-gray-50 text-maroon rounded-lg shrink-0">
                {booking.mode === "Online" ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mode</span>
                <span className="text-sm font-bold text-gray-800">{booking.mode}</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2 bg-gray-50 text-maroon rounded-lg shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Program</span>
                <span className="text-sm font-bold text-gray-800">{booking.programApplied}</span>
              </div>
            </div>
          </div>

          {/* Ticket Tear Dotted Separator */}
          <div className="relative flex items-center py-2">
            <div className="absolute left-[-24px] w-6 h-6 rounded-full bg-muted border-r border-gray-200 z-10" />
            <div className="w-full border-t border-dashed border-gray-200" />
            <div className="absolute right-[-24px] w-6 h-6 rounded-full bg-muted border-l border-gray-200 z-10" />
          </div>

          {/* Candidate Details summary */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Candidate Details</h4>
            <div className="grid grid-cols-2 gap-4 text-xs font-medium text-gray-600">
              <div>
                <p className="text-gray-400 font-normal">Name</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{booking.candidateName}</p>
              </div>
              <div>
                <p className="text-gray-400 font-normal">Application No.</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{booking.applicationNumber}</p>
              </div>
              <div>
                <p className="text-gray-400 font-normal">Email</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5 break-all">{booking.email}</p>
              </div>
              <div>
                <p className="text-gray-400 font-normal">Phone</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{booking.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        <Button
          onClick={handleDownloadConfirmation}
          className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer rounded-xl h-11 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download Confirmation</span>
        </Button>

        <Link href="/dashboard">
          <Button className="w-full bg-maroon text-white hover:bg-maroon/90 font-semibold cursor-pointer rounded-xl h-11 flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
