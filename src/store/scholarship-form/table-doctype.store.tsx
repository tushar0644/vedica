"use client";
import React, { createContext, useContext, useMemo, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApplicationFormDocType } from "@/types/application-form";
import { DocType } from "@/types";
interface StoreInterface {
  isFetching: boolean;
  isError: boolean;
  isLoading: boolean;
  data:
    | {
        sibling: DocType;
        reference: DocType;
      }
    | undefined;
  error: Error | null;
  refetch: () => Promise<any>;
}

const StoreContext = createContext<StoreInterface | null>(null);

function StoreContent({ children }: { children: React.ReactNode }) {
  const { isFetching, isError, isLoading, data, error, refetch } = useQuery<
    | {
        sibling: DocType;
        reference: DocType;
      }
    | undefined
  >({
    queryKey: ["scholarship-form-table-doctype"],
    queryFn: async () => {
      const res = await fetch("/api/v1/scholarship-form/doctype/table");
      const data = await res.json();
      console.log(data);
      return data;
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

export const ScholarshipTableFormDocTypeStore = ({
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

export const useScholarshipTableFormDocTypeStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx)
    throw new Error(
      "useScholarshipTableFormDocTypeStore must be used inside ScholarshipTableFormDocTypeStore",
    );
  return ctx;
};
