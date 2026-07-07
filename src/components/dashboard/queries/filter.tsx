import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQueryStore } from "@/store/query.store";
import QueriesModal from "./query-modal";
export default function QueryFilter() {
  const { data = [], isFetching, isLoading } = useQueryStore();

  const statsCount = data.reduce(
    (acc, item) => {
      acc.total++;

      if (item.status === "" || item.status === "Open") {
        acc.open++;
      } else if (item.status === "Close") {
        acc.closed++;
      }

      return acc;
    },
    {
      total: 0,
      open: 0,
      closed: 0,
    },
  );

  const stats = [
    {
      label: "Total Query",
      value: statsCount.total,
      active: true,
    },
    {
      label: "Open Query",
      value: statsCount.open,
      active: false,
    },
    {
      label: "Closed Query",
      value: statsCount.closed,
      active: false,
    },
  ];
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 md:gap-3">
        {stats.map((item) => (
          <Card
            key={item.label}
            className={`min-w-[50px] border rounded-none shadow-none h-fit! py-1.5! ${
              item.active ? "bg-base" : "bg-white"
            }`}
          >
            <CardContent className="flex items-center gap-3 p-2! py-0! h-fit!">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted text-sm font-semibold">
                {item.value}
              </div>

              <p
                className={`text-xs md:text-sm font-medium ${
                  item.active ? "text-black" : "text-gray-600"
                }`}
              >
                {item.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Raise Query */}
      <QueriesModal>
        <Button size={"lg"} variant="outline" className=" font-semibold">
          Raise Query
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </QueriesModal>
    </div>
  );
}
