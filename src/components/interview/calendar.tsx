"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { InterviewDate } from "@/types/interview";
import { cn } from "@/lib/utils";

interface CustomCalendarProps {
  availableDates: InterviewDate[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

export default function CustomCalendar({
  availableDates,
  selectedDate,
  onSelectDate,
}: CustomCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    // Start calendar month view on first available date or today
    if (availableDates.length > 0) {
      return new Date(availableDates[0].date);
    }
    return new Date();
  });

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Map dates for quick lookup
  const dateMap = useMemo(() => {
    const map = new Map<string, InterviewDate>();
    availableDates.forEach((d) => {
      map.set(d.date, d);
    });
    return map;
  }, [availableDates]);

  // Navigate to previous month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Generate calendar days
  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    // getDay returns 0 for Sunday, 1 for Monday, etc.
    const startDayOfWeek = firstDayOfMonth.getDay();

    const cells: { date: Date; dateStr: string; isCurrentMonth: boolean }[] = [];

    // Previous month padding days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, prevMonthLastDay - i);
      cells.push({
        date: d,
        dateStr: formatDateString(d),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(currentYear, currentMonth, i);
      cells.push({
        date: d,
        dateStr: formatDateString(d),
        isCurrentMonth: true,
      });
    }

    // Next month padding days to fill 6 rows (42 cells)
    const totalCells = 42;
    const remainingCells = totalCells - cells.length;
    for (let i = 1; i <= remainingCells; i++) {
      const d = new Date(currentYear, currentMonth + 1, i);
      cells.push({
        date: d,
        dateStr: formatDateString(d),
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  function formatDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  const todayStr = formatDateString(new Date());

  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 text-center mb-3">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-xs font-medium text-gray-400 py-1 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarCells.map(({ date, dateStr, isCurrentMonth }) => {
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const statusData = dateMap.get(dateStr);

          // If date doesn't exist in availability list or is flagged disabled
          const isAvailable = statusData && statusData.availability === "available";
          const isLimited = statusData && statusData.availability === "limited";
          const isFull = statusData && statusData.availability === "full";
          const isDisabled = !statusData || statusData.availability === "disabled" || !isCurrentMonth;

          // Compute button styling
          let indicatorColor = "bg-transparent";
          if (!isDisabled) {
            if (isAvailable) indicatorColor = "bg-green-500";
            if (isLimited) indicatorColor = "bg-orange-500";
            if (isFull) indicatorColor = "bg-red-500";
          }

          return (
            <button
              key={dateStr}
              type="button"
              disabled={!!isDisabled}
              data-availability={isDisabled ? "disabled" : (statusData?.availability || "disabled")}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                "relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-base/50 focus:ring-offset-2",
                // Hover effect for enabled days
                !isDisabled && "hover:bg-gray-50 cursor-pointer text-gray-900",
                // Active/Selected state
                isSelected && "bg-base! text-white! hover:bg-base!",
                // Disabled state
                isDisabled && "text-gray-300 cursor-not-allowed bg-transparent",
                // Today state
                isToday && !isSelected && "border border-base/30 bg-base/5 text-base font-bold"
              )}
              aria-label={`Select ${date.toLocaleDateString()} - ${
                statusData ? statusData.availability : "Unavailable"
              }`}
              title={statusData ? `${statusData.availability} slots` : "Unavailable"}
            >
              <span>{date.getDate()}</span>
              {/* Colored Dot Indicator */}
              {!isDisabled && (
                <span
                  className={cn(
                    "absolute bottom-2 w-1.5 h-1.5 rounded-full transition-colors",
                    isSelected ? "bg-white" : indicatorColor
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-2 justify-center text-xs text-gray-500 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
          <span>Limited Slots</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          <span>Fully Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-200 inline-block" />
          <span>Disabled</span>
        </div>
      </div>
    </div>
  );
}
