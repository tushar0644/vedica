"use client";

import { formatDate } from "./util";
import { Mail } from "lucide-react";

import { Communication } from "@/types";

export function CommunicationCard({
  communication,
}: {
  communication: Communication;
}) {
  return (
    <div className="flex md:flex-row flex-col items-start gap-6 border-b px-6 py-6 last:border-b-0">
      <div className="min-w-48 mt-auto">
        <p className="text-sm font-semibold text-muted-foreground">
          Date & Time
        </p>

        <p className="text-sm">
          {formatDate(new Date(communication.createdAt))}
        </p>
      </div>
      <div className="flex flex-col">
        <div className="">
          <Mail className="h-5 w-5 text-[#D8A16A]" strokeWidth={1.8} />
        </div>

        <div>
          <p className="text-sm font-semibold text-muted-foreground">
            Email having subject line:
          </p>

          <p className=" text-sm font-semibold text-[#2F2F6D]">
            {communication.subject}
          </p>
        </div>
      </div>
    </div>
  );
}
