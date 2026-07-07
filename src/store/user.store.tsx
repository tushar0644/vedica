"use client";
import React, { createContext, useContext, useMemo, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
interface StoreInterface {
  isFetching: boolean;
  isError: boolean;
  isLoading: boolean;
  data: User | undefined;
  error: Error | null;
  refetch: () => Promise<any>;
}

const StoreContext = createContext<StoreInterface | null>(null);

function StoreContent({ children }: { children: React.ReactNode }) {
  const { isFetching, isError, isLoading, data, error, refetch } = useQuery<
    User | undefined
  >({
    queryKey: ["account"],
    queryFn: async () => {
      const res = await fetch("/api/v1/user/account");
      const data = await res.json();
      // console.log(data);
      return data.user;
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

export const AccountStore = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<></>}>
      <StoreContent>{children}</StoreContent>
    </Suspense>
  );
};

export const useAccountStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAccountStore must be used inside AccountStore");
  return ctx;
};
