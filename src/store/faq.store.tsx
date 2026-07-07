"use client";

import React, { createContext, useContext, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { FAQ } from "@/types/faq";
import { useSearchParams } from "next/navigation";

interface StoreInterface {
  isFetching: boolean;
  isError: boolean;
  isLoading: boolean;
  data: FAQ[] | undefined;
  error: Error | null;
  refetch: () => Promise<any>;
}

const StoreContext = createContext<StoreInterface | null>(null);

function StoreContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const { isFetching, isError, isLoading, data, error, refetch } = useQuery<
    FAQ[] | undefined
  >({
    queryKey: ["faq", category],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (category) {
        params.set("category", category);
      }

      const url = `/api/v1/faq${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetch(url);
      const data = await res.json();

      return data.faq;
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

export const FAQStore = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<></>}>
      <StoreContent>{children}</StoreContent>
    </Suspense>
  );
};

export const useFAQStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useFAQStore must be used inside FAQStore");
  return ctx;
};
