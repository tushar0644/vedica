import Image from "next/image";
import React from "react";
import AdmissionCard from "./form";

export default function Hero() {
  return (
    <>
      <div className="h-45 sm:h-55 md:h-85 lg:h-110 xl:h-140 relative bg-maroon flex justify-between items-center">
        <div className=" max-w-310 w-full xl:w-7/8 relative h-full">
          <Image
            fill
            src="/banner-2.png"
            alt=""
            className="object-left"
          ></Image>
        </div>
        <div className="hidden lg:block mr-5">
          <AdmissionCard></AdmissionCard>
        </div>
      </div>

      <div className="lg:hidden block">
        <AdmissionCard></AdmissionCard>
      </div>
    </>
  );
}
