"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, User, GraduationCap, MapPin, Loader2 } from "lucide-react";
import { CandidateDetails, InterviewMode } from "@/types/interview";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  date: string;
  time: string;
  mode: InterviewMode;
  candidateDetails: CandidateDetails;
  isLoading: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  date,
  time,
  mode,
  candidateDetails,
  isLoading,
}: ConfirmationDialogProps) {
  // Format readable date
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden p-0!">
        {/* Decorative Header Block */}
        <div className="bg-maroon text-white p-6 relative">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            Confirm Booking Details
          </DialogTitle>
          <DialogDescription className="text-maroon-100 mt-1.5 text-xs opacity-90 text-gray-200">
            Please double-check your appointment slot details before confirming.
          </DialogDescription>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5">
          {/* Appointment Meta Grid */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="w-4 h-4 text-maroon shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</span>
                <span className="text-sm font-semibold text-gray-900">{formattedDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Clock className="w-4 h-4 text-maroon shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time & Timezone</span>
                <span className="text-sm font-semibold text-gray-900">{time} <span className="text-xs text-gray-500 font-medium">(IST - UTC+5:30)</span></span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              {mode === "Online" ? (
                <Video className="w-4 h-4 text-maroon shrink-0" />
              ) : (
                <MapPin className="w-4 h-4 text-maroon shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Interview Mode</span>
                <span className="text-sm font-semibold text-gray-900">{mode} {mode === "Online" ? "(Microsoft Teams/Zoom)" : "(On Campus)"}</span>
              </div>
            </div>
          </div>

          {/* Candidate Meta Info */}
          <div className="space-y-3 px-1">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Candidate</span>
                <span className="text-sm font-semibold text-gray-800">{candidateDetails.name}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Program</span>
                <span className="text-sm font-semibold text-gray-800">{candidateDetails.programApplied}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dialog Action Buttons */}
        <DialogFooter className="bg-gray-50/50 border-t border-gray-100 p-4 flex flex-row gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 sm:flex-none border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer rounded-xl h-11"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="flex-1 sm:flex-none bg-maroon text-white hover:bg-maroon/90 font-semibold cursor-pointer rounded-xl h-11 flex items-center justify-center gap-1.5 min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Confirming...</span>
              </>
            ) : (
              <span>Confirm Booking</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
