// application-carousel.tsx
"use client";

import {
  ChevronLeft,
  ChevronRight,
  User,
  Users,
  MapPin,
  FileText,
  Briefcase,
  Drama,
  Paperclip,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";

import type { CarouselApi } from "@/components/ui/carousel";
import { useApplication } from "./provider";

const steps = [
  {
    title: "Personal Details",
    icon: User,
  },
  {
    title: "Parent's Details",
    icon: Users,
  },
  {
    title: "Address Details",
    icon: MapPin,
  },
  {
    title: "Academic Details",
    icon: FileText,
  },
  {
    title: "Work Experience Details",
    icon: Briefcase,
  },
  {
    title: "Extra-Curricular Activities",
    icon: Drama,
  },
  {
    title: "Upload Documents",
    icon: Paperclip,
  },
  {
    title: "Declaration",
    icon: Sparkles,
  },
];

function CarouselControls() {
  const { scrollNext, scrollPrev } = useCarousel();

  return (
    <>
      <button
        type="button"
        onClick={() => scrollPrev()}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2"
      >
        <ChevronLeft className="h-8 w-8 text-[#9d9d9d]" strokeWidth={2.5} />
      </button>

      <button
        type="button"
        onClick={() => scrollNext()}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2"
      >
        <ChevronRight className="h-8 w-8 text-[#9d9d9d]" strokeWidth={2.5} />
      </button>
    </>
  );
}

function StepCard({
  step,
  index,
  // isScrolled,
}: {
  step: any;
  index: number;
  // isScrolled: boolean;
}) {
  const isScrolled = false;
  const { currentStep, setCurrentStep } = useApplication();

  const Icon = step.icon;

  const isActive = currentStep === index;
  const isCompleted = currentStep > index;

  return (
    <button
      type="button"
      onClick={() => setCurrentStep(index)}
      className={`
  flex w-full flex-col items-center justify-center text-center
  transition-all duration-300
  ${isScrolled ? "gap-1" : "gap-3"}
`}
    >
      <div
        className={`
    flex items-center justify-center rounded-full border-[3px] shadow-md transition-all duration-300
    ${isScrolled ? "h-16 w-16" : "h-20 w-20"}

    ${
      isActive
        ? "border-[#d7d7f7] bg-[#2d3d94]"
        : isCompleted
          ? "border-[#d7d7d7] bg-[#00796b]"
          : "border-[#d7d7d7] bg-[#d9d9d9]"
    }
  `}
      >
        <Icon
          className={`
    text-white transition-all duration-300
    ${isScrolled ? "h-6 w-6" : "h-9 w-9"}
  `}
          strokeWidth={2.2}
        />
      </div>

      <p
        className={`
    text-center font-semibold leading-4 text-black transition-all duration-300
    ${isScrolled ? "max-w-[80px] text-[10px]" : "max-w-[100px] text-[12px]"}
  `}
      >
        {step.title}
      </p>
    </button>
  );
}

export default function ApplicationCarousel() {
  const [
    isScrolled,
    // setIsScrolled
  ] = useState(false);

  const [api, setApi] = useState<CarouselApi>();
  const { currentStep } = useApplication();
  useEffect(() => {
    if (!api) return;

    api.scrollTo(currentStep);
  }, [api, currentStep]);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 40);
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);
  useEffect(() => {
    if (!api) return;

    const visibleItems =
      window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 2;

    const target = Math.max(
      0,
      Math.min(
        currentStep - Math.floor(visibleItems / 2),
        steps.length - visibleItems,
      ),
    );

    api.scrollTo(target);
  }, [api, currentStep]);
  return (
    <div
      className={`
    sticky top-0 z-50 w-full border-b backdrop-blur
    transition-all duration-300
    ${isScrolled ? "px-2 py-2" : "px-4 py-4"}
  `}
    >
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
        }}
        className="relative w-full"
      >
        <CarouselContent className="-ml-2">
          {steps.map((step, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 pl-2 md:basis-1/3 lg:basis-1/4"
            >
              <StepCard
                step={step}
                index={index}
                // isScrolled={isScrolled}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselControls />
      </Carousel>
    </div>
  );
}
