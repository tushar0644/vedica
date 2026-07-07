import { useMemo } from "react";
import { communications } from "@/constants/ui";
import { formatMonth } from "./util";
import { Communication } from "@/types";
import { CommunicationCard } from "./card,";
import SearchFilterBar from "./fitler";
export default function Communications() {
  const groupedCommunications = useMemo(() => {
    const sorted = [...communications].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Group by month
    const grouped = sorted.reduce(
      (acc, communication) => {
        const date = new Date(communication.createdAt);

        const monthKey = formatMonth(date);

        if (!acc[monthKey]) {
          acc[monthKey] = [];
        }

        acc[monthKey].push(communication);

        return acc;
      },
      {} as Record<string, Communication[]>,
    );

    return grouped;
  }, []);

  return (
    <div className="min-h-screen space-y-4 ">
      <SearchFilterBar></SearchFilterBar>

      <div className="space-y-8">
        {Object.entries(groupedCommunications).map(
          ([month, communications]) => (
            <section key={month}>
              <div className="mb-2">
                <p className="text-sm font-semibold text-muted-foreground">
                  {month}
                </p>
              </div>

              <div className="overflow-hidden rounded-sm border border-[#E5E5E5] bg-white">
                {communications.map((communication) => (
                  <CommunicationCard
                    key={communication.id}
                    communication={communication}
                  />
                ))}
              </div>
            </section>
          ),
        )}
      </div>
    </div>
  );
}
