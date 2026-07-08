"use client";

import { useApplicationFormListStore } from "@/store/application-form/list.store";
import ApplicationStatusCard from "./card";
import StartApplicationStatusCard from "./start-card";
import { ApplicationStatusCardSkeleton } from "./loader";
export default function Applications() {
  const { data, isLoading, isFetching } = useApplicationFormListStore();
  if (isLoading || isFetching || !data)
    return <ApplicationStatusCardSkeleton />;
  if (data.length === 0) return <StartApplicationStatusCard />;
  return (
    <>
      <ApplicationStatusCard {...data[0]}></ApplicationStatusCard>
    </>
  );
}
