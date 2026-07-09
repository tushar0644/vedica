"use client";
import React, { createContext, useContext, useMemo, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApplicationFormView } from "@/types/application-form";
interface StoreInterface {
  isFetching: boolean;
  isError: boolean;
  isLoading: boolean;
  data: ApplicationFormView[] | undefined;
  error: Error | null;
  refetch: () => Promise<any>;
}

const StoreContext = createContext<StoreInterface | null>(null);

function StoreContent({ children }: { children: React.ReactNode }) {
  const { isFetching, isError, isLoading, data, error, refetch } = useQuery<
    ApplicationFormView[] | undefined
  >({
    queryKey: ["application-forms"],
    queryFn: async () => {
      const res = await fetch("/api/v1/application-form");
      const data = await res.json();
      if (!data.success && data.message === "Unauthorized") {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/?type=login";
        return [];
      }
      const forms = data.forms as ApplicationFormView[];
      if (forms && Array.isArray(forms)) {
        forms.sort((a, b) => b.name.localeCompare(a.name));
      }
      return forms;
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

export const ApplicationFormListStore = ({
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

export const useApplicationFormListStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx)
    throw new Error(
      "useApplicationFormListStore must be used inside ApplicationFormListStore",
    );
  return ctx;
};
