"use client";

import React from "react";
import { Check } from "lucide-react";
import { InterviewSlot } from "@/types/interview";
import { cn } from "@/lib/utils";

interface SlotsListProps {
  slots: InterviewSlot[];
  selectedSlot: string | null;
  onSelectSlot: (slotTime: string) => void;
}

export default function SlotsList({ slots, selectedSlot, onSelectSlot }: SlotsListProps) {
  if (slots.length === 0) {
    return (
      <div className="w-full flex items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-gray-500 font-medium">
        No time slots are configured for this date.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-700">Select Available Time Slot</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot.time;
          const isFull = slot.availability === "full" || slot.remainingSeats <= 0;
          const isDisabled = slot.availability === "disabled" || isFull;

          // Badges style matching availability
          let badgeClass = "bg-green-50 text-green-700 border-green-200";
          let labelText = "Available";

          if (isFull) {
            badgeClass = "bg-red-50 text-red-700 border-red-200";
            labelText = "Full";
          } else if (slot.availability === "limited") {
            badgeClass = "bg-orange-50 text-orange-700 border-orange-200";
            labelText = "Limited";
          }

          return (
            <button
              key={slot.time}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectSlot(slot.time)}
              className={cn(
                "relative flex flex-col items-start gap-2 p-3.5 border rounded-xl transition-all text-left focus:outline-none focus:ring-2 focus:ring-base/50",
                // Active/Selected state
                isSelected
                  ? "bg-maroon/5 border-maroon shadow-md translate-y-[-2px] ring-1 ring-maroon"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm hover:translate-y-[-1px]",
                // Disabled state
                isDisabled && "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed transform-none hover:shadow-none"
              )}
            >
              {/* Checked Indicator */}
              {isSelected && (
                <span className="absolute top-2.5 right-2.5 bg-maroon text-white p-0.5 rounded-full">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              )}

              {/* Time */}
              <span className={cn(
                "text-base font-bold",
                isSelected ? "text-maroon" : "text-gray-900",
                isDisabled && "text-gray-400"
              )}>
                {slot.time}
              </span>

              {/* Seats Info */}
              <div className="flex flex-col gap-1 w-full">
                <span className={cn(
                  "text-[11px] font-medium px-2 py-0.5 border rounded-full w-fit",
                  badgeClass,
                  isDisabled && "bg-gray-100 text-gray-400 border-gray-200"
                )}>
                  {labelText}
                </span>

                <span className="text-[11px] text-gray-500 font-medium">
                  {isFull ? "0 seats left" : `${slot.remainingSeats} seats left`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
