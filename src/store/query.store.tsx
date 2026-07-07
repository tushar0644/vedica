"use client";
import React, { createContext, useContext, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { Query } from "@/types/query";
interface StoreInterface {
  isFetching: boolean;
  isError: boolean;
  isLoading: boolean;
  data: Query[] | undefined;
  error: Error | null;
  refetch: () => Promise<any>;
}

const StoreContext = createContext<StoreInterface | null>(null);

function StoreContent({ children }: { children: React.ReactNode }) {
  const { isFetching, isError, isLoading, data, error, refetch } = useQuery<
    Query[] | undefined
  >({
    queryKey: ["query"],
    queryFn: async () => {
      const res = await fetch("/api/v1/query");
      const data = await res.json();

      return data.queries;
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

export const QueryStore = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<></>}>
      <StoreContent>{children}</StoreContent>
    </Suspense>
  );
};

export const useQueryStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useQueryStore must be used inside QueryStore");
  return ctx;
};
