"use client";
import Image from "next/image";
import React from "react";
import QueriesModal from "./query-modal";
import { useQueryStore } from "@/store/query.store";

export default function NoQueries() {
  const { data, isFetching, isLoading } = useQueryStore();
  if (!isFetching && !isLoading && data && data.length === 0)
    return (
      <div className="bg-white flex justify-center items-center shadow-sm min-h-50 w-full rounded-lg p-2">
        <div className="flex items-center justify-center flex-col">
          <Image src="/queries.webp" alt="" height={100} width={100}></Image>

          <p className="text-sm mt-2 text-center">
            You have not raised any Query.{" "}
            <QueriesModal>
              <span className="text-blue-700 cursor-pointer">Raise Query</span>
            </QueriesModal>
          </p>
        </div>
      </div>
    );
}
