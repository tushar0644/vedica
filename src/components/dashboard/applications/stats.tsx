"use client";

import { useApplicationFormListStore } from "@/store/application-form/list.store";
export default function ApplicationStats() {
  const { data} =
    useApplicationFormListStore();

  return (
    <div className="flex flex-col gap-4 rounded-md lg:flex-row lg:items-center lg:justify-between">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="flex w-full h-fit items-center gap-3 rounded-md bg-base p-2.5 text-white shadow-sm transition hover:opacity-95"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white text-sm font-bold">
            {String(data?.length ?? 0).padStart(2, "0")}
          </div>

          <div className="min-w-0 text-left">
            <p className="text-xs font-semibold leading-5 sm:text-sm">
              Application In Progress
            </p>
          </div>
        </button>

        <button
          type="button"
          className="flex w-full h-fit items-center gap-3 rounded-md bg-base p-2.5 text-white shadow-sm transition hover:opacity-95"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white text-sm font-bold">
            {String(
              data?.filter((ele) => ele.docstatus === 1).length ?? 0,
            ).padStart(2, "0")}
          </div>

          <div className="min-w-0 text-left">
            <p className="text-xs font-semibold leading-5 sm:text-sm">
              Application Completed
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
