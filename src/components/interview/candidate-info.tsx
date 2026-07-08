"use client";

import React from "react";
import { User, FileSpreadsheet, Mail, Phone, GraduationCap } from "lucide-react";
import { CandidateDetails } from "@/types/interview";

interface CandidateInfoProps {
  details: CandidateDetails;
}

export default function CandidateInfo({ details }: CandidateInfoProps) {
  const fields = [
    {
      label: "Candidate Name",
      value: details.name,
      icon: User,
    },
    {
      label: "Application No.",
      value: details.applicationNumber,
      icon: FileSpreadsheet,
    },
    {
      label: "Program Applied",
      value: details.programApplied,
      icon: GraduationCap,
    },
    {
      label: "Email Address",
      value: details.email,
      icon: Mail,
    },
    {
      label: "Phone Number",
      value: details.phone,
      icon: Phone,
    },
  ];

  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
        <div className="p-2.5 bg-maroon/5 text-maroon rounded-xl">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">Candidate Information</h3>
          <p className="text-xs text-gray-500">Please verify your details before booking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {fields.map((field, idx) => {
          const Icon = field.icon;
          return (
            <div key={idx} className="flex gap-3.5 items-start">
              <div className="p-2 bg-gray-50 text-gray-400 rounded-lg shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                  {field.label}
                </span>
                <span className="text-sm font-semibold text-gray-800 break-all">
                  {field.value || "-"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
