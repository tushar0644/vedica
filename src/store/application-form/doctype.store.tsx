"use client";
import React, { createContext, useContext, useMemo, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApplicationFormDocType } from "@/types/application-form";
interface StoreInterface {
  isFetching: boolean;
  isError: boolean;
  isLoading: boolean;
  data: ApplicationFormDocType | undefined;
  error: Error | null;
  refetch: () => Promise<any>;
}

const StoreContext = createContext<StoreInterface | null>(null);

function StoreContent({ children }: { children: React.ReactNode }) {
  const { isFetching, isError, isLoading, data, error, refetch } = useQuery<
    ApplicationFormDocType | undefined
  >({
    queryKey: ["application-form-doctype"],
    queryFn: async () => {
      const res = await fetch("/api/v1/application-form/doctype");
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

export const ApplicationFormDocTypeStore = ({
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

export const useApplicationFormDocTypeStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx)
    throw new Error(
      "useApplicationFormDocTypeStore must be used inside ApplicationFormDocTypeStore",
    );
  return ctx;
};
