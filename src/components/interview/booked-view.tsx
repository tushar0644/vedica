"use client";

import React, { useState } from "react";
import { Calendar, Clock, Video, Tag, User, MapPin, Trash2, CalendarRange, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InterviewBooking } from "@/types/interview";

interface BookedViewProps {
  booking: InterviewBooking;
  onReschedule: () => void;
  onCancel: () => void;
  isCancelling: boolean;
}

export default function BookedView({ booking, onReschedule, onCancel, isCancelling }: BookedViewProps) {
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Scheduled Interview</h2>
          <p className="text-sm text-gray-500">You have a confirmed interview session. Review details below.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Scheduled Session</span>
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_260px]">
        {/* Left Side: Session Meta */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex gap-3 items-start">
              <div className="p-2.5 bg-gray-50 text-maroon rounded-xl shrink-0 mt-0.5">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</span>
                <span className="text-sm font-semibold text-gray-900">{formattedDate}</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2.5 bg-gray-50 text-maroon rounded-xl shrink-0 mt-0.5">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time & Timezone</span>
                <span className="text-sm font-semibold text-gray-900">{booking.time} <span className="text-xs text-gray-500 font-normal">({booking.timezone})</span></span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2.5 bg-gray-50 text-maroon rounded-xl shrink-0 mt-0.5">
                {booking.mode === "Online" ? <Video className="w-4.5 h-4.5" /> : <MapPin className="w-4.5 h-4.5" />}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mode</span>
                <span className="text-sm font-semibold text-gray-900">{booking.mode}</span>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="p-2.5 bg-gray-50 text-maroon rounded-xl shrink-0 mt-0.5">
                <Tag className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Program</span>
                <span className="text-sm font-semibold text-gray-900">{booking.programApplied}</span>
              </div>
            </div>
          </div>

          {/* Dotted divider */}
          <div className="border-t border-dashed border-gray-150" />

          {/* Candidate details sub-list */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Candidate Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold text-gray-800">
              <div className="flex gap-2.5 items-center">
                <User className="w-4 h-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-450 font-normal">Name</span>
                  <span>{booking.candidateName}</span>
                </div>
              </div>
              <div className="flex gap-2.5 items-center">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-450 font-normal">Application Number</span>
                  <span>{booking.applicationNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Reference / Action Panel */}
        <div className="bg-gray-50 border-t md:border-t-0 md:border-l border-gray-100 p-6 flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-1 bg-white border border-gray-150 p-4 rounded-xl shadow-2xs">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Reference No.</span>
            <span className="text-base font-mono font-bold text-gray-900 tracking-wide">{booking.referenceNumber}</span>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmCancel(true)}
              className="w-full border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50/50 font-semibold cursor-pointer rounded-xl h-10 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Cancel Booking</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Cancellation Warning Inline Box */}
      {showConfirmCancel && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 flex flex-col gap-4 animate-in fade-in-50 zoom-in-95 duration-200">
          <div className="flex gap-3.5 items-start">
            <div className="p-2 bg-red-100 text-red-700 rounded-xl">
              <AlertTriangle className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-900">Are you sure you want to cancel?</h4>
              <p className="text-xs text-red-600 mt-1 leading-relaxed">
                Cancelling this booking will release your reserved slot. You will need to select a new date and time if you choose to reschedule later.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              disabled={isCancelling}
              onClick={() => setShowConfirmCancel(false)}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer rounded-xl h-9"
            >
              No, Keep Booking
            </Button>
            <Button
              disabled={isCancelling}
              onClick={onCancel}
              className="bg-red-600 text-white hover:bg-red-700 font-semibold cursor-pointer rounded-xl h-9 flex items-center gap-1.5"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <span>Yes, Cancel Interview</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
