"use client";
import React, { createContext, useContext, useMemo, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScholarshipFormDocType } from "@/types/scholarship";
interface StoreInterface {
  isFetching: boolean;
  isError: boolean;
  isLoading: boolean;
  data: ScholarshipFormDocType | undefined;
  error: Error | null;
  refetch: () => Promise<any>;
}

const StoreContext = createContext<StoreInterface | null>(null);

function StoreContent({ children }: { children: React.ReactNode }) {
  const { isFetching, isError, isLoading, data, error, refetch } = useQuery<
    ScholarshipFormDocType | undefined
  >({
    queryKey: ["scholarship-form-doctype"],
    queryFn: async () => {
      const res = await fetch("/api/v1/scholarship-form/doctype");
      const data = await res.json();
      return data.fieldMap;
    },

    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <StoreContext.Provider
      value={{ isLoading, isError, isFetching, data, error, refetch }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const ScholarshipFormDocTypeStore = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Suspense fallback={<></>}>
      <StoreContent>{children}</StoreContent>
    </Suspense>
  );
};

export const useScholarshipFormDocTypeStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx)
    throw new Error(
      "useScholarshipFormDocTypeStore must be used inside ScholarshipFormDocTypeStore",
    );
  return ctx;
};
