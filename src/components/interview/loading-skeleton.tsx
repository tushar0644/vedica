"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title block skeleton */}
      <div className="space-y-2 pb-5 border-b border-gray-150">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Main Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Candidate Info Card skeleton */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex gap-3 items-center">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4.5 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Card skeleton */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5.5 w-32" />
              <div className="flex gap-2">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="w-8 h-8 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(35)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Time Slot lists skeleton */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
            <Skeleton className="h-5 w-40" />
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          </div>

          {/* Action pane skeleton */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
