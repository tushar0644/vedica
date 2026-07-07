"use client";
import React from "react";
import NoQueries from "./no-queries";
import QueryFilter from "./filter";
import QueryCard from "./card";
import { useQueryStore } from "@/store/query.store";
import QueryCardSkeleton from "./loader";
export default function Queries() {
  const { data, isFetching, isLoading } = useQueryStore();
  return (
    <>
      <NoQueries></NoQueries>
      <div className="w-full space-y-5 mt-4">
        <QueryFilter></QueryFilter>
        {isFetching || isLoading || !data ? (
          <>
            <QueryCardSkeleton />
          </>
        ) : (
          <>
            {data.map((ele) => {
              return <QueryCard {...ele}></QueryCard>;
            })}
          </>
        )}
      </div>
    </>
  );
}
