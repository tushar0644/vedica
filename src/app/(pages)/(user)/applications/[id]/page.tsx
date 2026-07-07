import Applications from "@/components/applications";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Form",
};

export default function Page() {
  return (
    <main className="flex w-full justify-center bg-white">
      <Applications />
    </main>
  );
}
