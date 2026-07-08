"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Video, MapPin, AlertCircle, RefreshCw, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccountStore } from "@/store/user.store";
import { useApplicationFormListStore } from "@/store/application-form/list.store";
import { useRouter } from "next/navigation";
import { isInterviewEligible } from "@/lib/interview-eligibility";
import {
  useInterviewStatus,
  useAvailableDates,
  useAvailableSlots,
  useBookInterview,
  useRescheduleInterview,
  useCancelInterview,
} from "@/hooks/use-interview";
import { CandidateDetails, InterviewMode, InterviewBooking } from "@/types/interview";

// Component imports
import CustomCalendar from "./calendar";
import SlotsList from "./slots-list";
import CandidateInfo from "./candidate-info";
import ConfirmationDialog from "./confirmation-dialog";
import SuccessView from "./success-view";
import BookedView from "./booked-view";
import LoadingSkeleton from "./loading-skeleton";

export default function InterviewScheduler() {
  const { data: user, isLoading: userLoading } = useAccountStore();
  const { data: apps, isLoading: appsLoading } = useApplicationFormListStore();
  const router = useRouter();

  const activeApp = apps && apps.length > 0 ? apps[0] : null;
  const isEligible = isInterviewEligible(activeApp);

  useEffect(() => {
    if (!appsLoading && !isEligible) {
      router.replace("/dashboard");
      toast.error(
        "You can schedule your interview only after submitting your application and receiving your Offer Letter."
      );
    }
  }, [isEligible, appsLoading, router]);

  const {
    data: activeBooking,
    isLoading: statusLoading,
    isError: statusError,
    refetch: refetchStatus,
  } = useInterviewStatus();

  const {
    data: availableDates = [],
    isLoading: datesLoading,
    isError: datesError,
    refetch: refetchDates,
  } = useAvailableDates();

  // Local state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [interviewMode, setInterviewMode] = useState<InterviewMode>("Online");
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [justBookedBooking, setJustBookedBooking] = useState<InterviewBooking | null>(null);

  // Fetch slots for selected date
  const {
    data: slotData,
    isLoading: slotsLoading,
    isError: slotsError,
  } = useAvailableSlots(selectedDate);

  // Mutations
  const bookMutation = useBookInterview();
  const rescheduleMutation = useRescheduleInterview();
  const cancelMutation = useCancelInterview();

  // Reset selected slot when date changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate]);

  // Handle errors / retries
  const handleRetryAll = () => {
    refetchStatus();
    refetchDates();
  };

  // Compile candidate details from store
  const candidateDetails: CandidateDetails = React.useMemo(() => {
    const name = user
      ? [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ")
      : "Candidate Name";
    const applicationNumber = apps && apps.length > 0 ? apps[0].name : "VS2026-PENDING";
    const programApplied = user?.custom_select_course || "Vedica Scholars Programme";
    const email = user?.custom_emailss || user?.username || "candidate@example.com";
    const phone = user?.custom_mobile_nos || user?.phone || "+91 99999 99999";

    return { name, applicationNumber, programApplied, email, phone };
  }, [user, apps]);

  if (userLoading || appsLoading || statusLoading || datesLoading || !isEligible) {
    return <LoadingSkeleton />;
  }

  if (statusError || datesError) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-100 rounded-2xl text-center space-y-4 shadow-sm my-10">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-red-900">Failed to load Scheduler</h3>
        <p className="text-sm text-red-600">
          We encountered an error loading the availability schedule. Please check your connection and try again.
        </p>
        <Button
          onClick={handleRetryAll}
          className="bg-red-600 text-white hover:bg-red-700 font-semibold cursor-pointer rounded-xl h-10 flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </Button>
      </div>
    );
  }

  // Success view (immediately after booking)
  if (justBookedBooking) {
    return (
      <SuccessView
        booking={justBookedBooking}
        onReschedule={() => {
          setIsRescheduling(true);
          setJustBookedBooking(null);
          setSelectedDate(null);
          setSelectedSlot(null);
        }}
      />
    );
  }

  // Active booking review view
  if (activeBooking && !isRescheduling) {
    return (
      <BookedView
        booking={activeBooking}
        isCancelling={cancelMutation.isPending}
        onReschedule={() => {
          setIsRescheduling(true);
          setSelectedDate(activeBooking.date);
          setSelectedSlot(activeBooking.time);
          setInterviewMode(activeBooking.mode);
        }}
        onCancel={async () => {
          try {
            await cancelMutation.mutateAsync();
            toast.success("Interview session cancelled successfully.");
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to cancel booking.");
          }
        }}
      />
    );
  }

  // Booking / Rescheduling Calendar slots layout
  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot) return;

    setShowConfirmModal(false);
    const payload = {
      date: selectedDate,
      time: selectedSlot,
      mode: interviewMode,
      candidateName: candidateDetails.name,
      applicationNumber: candidateDetails.applicationNumber,
      programApplied: candidateDetails.programApplied,
      phone: candidateDetails.phone,
    };

    try {
      if (isRescheduling) {
        const updated = await rescheduleMutation.mutateAsync(payload);
        toast.success("Interview rescheduled successfully!");
        setJustBookedBooking(updated);
        setIsRescheduling(false);
      } else {
        const booked = await bookMutation.mutateAsync(payload);
        toast.success("Interview booked successfully!");
        setJustBookedBooking(booked);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to book interview slot.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900">
            {isRescheduling ? "Reschedule Interview Session" : "Schedule Interview Session"}
          </h2>
          <p className="text-sm text-gray-500">
            Select your preferred date, interview mode, and time slot below.
          </p>
        </div>

        {isRescheduling && activeBooking && (
          <Button
            variant="outline"
            onClick={() => {
              setIsRescheduling(false);
              setSelectedDate(null);
              setSelectedSlot(null);
            }}
            className="flex items-center gap-1.5 border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer rounded-xl h-10"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Keep Booking</span>
          </Button>
        )}
      </div>

      {/* Main Form Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        
        {/* Left Side Column */}
        <div className="space-y-6">
          <CandidateInfo details={candidateDetails} />
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Select Date</h3>
            <CustomCalendar
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        </div>

        {/* Right Side Column */}
        <div className="space-y-6">
          {/* Interview Mode Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Interview Mode</h3>
            <div className="flex items-center gap-3.5 p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <div className="p-2.5 bg-maroon/5 text-maroon rounded-xl shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-gray-900">Online Interview</span>
                <span className="text-[10px] text-gray-500 font-medium">via Microsoft Teams / Zoom</span>
              </div>
            </div>
          </div>

          {/* Time Slots Area */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[220px]">
            {selectedDate ? (
              slotsLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-maroon" />
                  <span className="text-xs text-gray-400 font-medium">Fetching slots...</span>
                </div>
              ) : slotsError ? (
                <div className="text-center py-10 space-y-2">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                  <p className="text-xs text-red-600 font-medium">Failed to load slots</p>
                </div>
              ) : (
                <SlotsList
                  slots={slotData?.slots || []}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4 gap-3">
                <div className="p-3 bg-gray-50 rounded-full text-gray-350">
                  <RefreshCw className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700">Choose a Date First</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">
                    Time slots will populate once you select an available date from the calendar.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action Pane */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3">
            <Button
              type="button"
              disabled={!selectedDate || !selectedSlot}
              onClick={() => setShowConfirmModal(true)}
              className="w-full bg-maroon text-white hover:bg-maroon/90 font-semibold cursor-pointer rounded-xl h-11 flex items-center justify-center"
            >
              <span>{isRescheduling ? "Confirm Rescheduling" : "Schedule Interview"}</span>
            </Button>
            
            <p className="text-[10px] text-gray-400 text-center leading-relaxed">
              By confirming, you agree to attend the session at the selected date and time.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Overlay Modal */}
      {selectedDate && selectedSlot && (
        <ConfirmationDialog
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmBooking}
          date={selectedDate}
          time={selectedSlot}
          mode={interviewMode}
          candidateDetails={candidateDetails}
          isLoading={bookMutation.isPending || rescheduleMutation.isPending}
        />
      )}
    </div>
  );
}
