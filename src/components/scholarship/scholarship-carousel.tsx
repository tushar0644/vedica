// application-carousel.tsx
"use client";

import {


  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";

const steps = [
  {
    title: "Scholarship",
    icon: Wallet,
  },
];

function StepCard({
  step,
  index,
  isScrolled,
}: {
  step: any;
  index: number;
  isScrolled: boolean;
}) {
  const Icon = step.icon;

  return (
    <button
      type="button"
      className="flex w-full flex-col items-center justify-center text-center"
    >
      <div
        className={`
          flex items-center justify-center rounded-full border-[3px] shadow-md
          transition-all duration-300
          ${isScrolled ? "h-16 w-16" : "h-20 w-20"}
          border-[#d7d7d7] bg-[#2d3d94]
        `}
      >
        <Icon
          className={`${isScrolled ? "h-6 w-6" : "h-9 w-9"} text-white`}
          strokeWidth={2.2}
        />
      </div>

      <p
        className={`
          text-center font-semibold text-black
          ${isScrolled ? "text-[10px]" : "text-[12px]"}
        `}
      >
        {step.title}
      </p>
    </button>
  );
}
export default function ScholarshipCarousel() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className={`
    sticky top-0 z-50 w-full border-b backdrop-blur
    transition-all duration-300
    ${isScrolled ? "px-2 py-2" : "px-4 py-4"}
  `}
    >
      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-full"
      >
        <CarouselContent className="-ml-2">
          {steps.map((step, index) => (
            <CarouselItem
              key={index}
              className="basis-1/1 xs:basis-1/2 pl-2 md:basis-1/3 lg:basis-1/4"
            >
              <StepCard step={step} index={index} isScrolled={isScrolled} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
