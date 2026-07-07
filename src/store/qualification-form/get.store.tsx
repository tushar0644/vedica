"use client";
import React, { createContext, useContext, useMemo, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
interface StoreInterface {
  isFetching: boolean;
  isError: boolean;
  isLoading: boolean;
  data: any | undefined;
  error: Error | null;
  refetch: () => Promise<any>;
}

const StoreContext = createContext<StoreInterface | null>(null);

function StoreContent({ children }: { children: React.ReactNode }) {
  const { id } = useParams();

  const { isFetching, isError, isLoading, data, error, refetch } = useQuery<
    any | undefined
  >({
    queryKey: ["qualification-form", id],
    queryFn: async () => {
      const res = await fetch(`/api/v1/qualification-form`);
      const data = await res.json();
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

export const QualificationFormStore = ({
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

export const useQualificationFormStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx)
    throw new Error(
      "useQualificationFormStore must be used inside QualificationFormStore",
    );
  return ctx;
};
