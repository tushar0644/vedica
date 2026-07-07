"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Minus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { FAQContent } from "@/constants/faq";
import { useFAQStore } from "@/store/faq.store";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function FAQFilters({
  search,
  setSearch,
  category,
  categories,
}: {
  categories: string[];
  search: string;
  setSearch: (value: string) => void;
  category: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    router.replace(
      `${pathname}${params.toString() ? `?${params.toString()}` : ""}`,
      { scroll: false },
    );
  };

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-md bg-[#efefef] p-4 md:flex-row">
      <div className="w-full md:w-[320px]">
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger className="h-11! bg-white">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Select Category</SelectItem>

            <SelectItem key="Admission" value="Admission">
              Admission
            </SelectItem>
            <SelectItem key="About the Programme" value="About the Programme">
              About the Programme
            </SelectItem>
            <SelectItem key="Course Curriculum" value="Course Curriculum">
              Course Curriculum
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by FAQ"
          className="h-11 bg-white pr-10"
        />
      </div>
    </div>
  );
}
export default function FAQSection() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const { data, isLoading, isFetching } = useFAQStore();
  const filteredFAQs = useMemo(() => {
    if (!data) return [];

    const query = search.trim().toLowerCase();

    if (!query) return data;

    return data.filter((faq) => faq.question.toLowerCase().includes(query));
  }, [data, search]);

  return (
    <section className="w-full">
      <FAQFilters
        categories={data?.map((ele) => ele.category) ?? []}
        search={search}
        setSearch={setSearch}
        category={category}
      />

      <Accordion
        type="single"
        collapsible
        className="space-y-3"
        defaultValue="item-0"
      >
        {filteredFAQs?.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="overflow-hidden rounded-sm border border-[#d7d7d7] bg-[#e4a05f]"
          >
            <AccordionTrigger className="px-5 py-4 text-left text-[15px] font-medium text-black no-underline hover:no-underline">
              <div className="flex w-full items-center justify-between">
                <span>{faq.question}</span>

                <span className="ml-4 shrink-0">
                  <Plus
                    data-slot="accordion-trigger-icon"
                    className="pointer-events-none shrink-0 text-black! group-aria-expanded/accordion-trigger:hidden"
                  />
                  <Minus
                    data-slot="accordion-trigger-icon"
                    className="pointer-events-none hidden text-black! shrink-0 group-aria-expanded/accordion-trigger:inline"
                  />
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="bg-white px-5 py-5">
              <p className="text-[15px] leading-7 text-muted-foreground">
                {faq.answers}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Toggle Icons */}
      <style jsx>{`
        [data-state="open"] .accordion-plus {
          display: none;
        }

        [data-state="open"] .accordion-minus {
          display: block;
        }
      `}</style>
    </section>
  );
}
