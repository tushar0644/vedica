import Image from "next/image";
import React from "react";

export default function NoPayments() {
  return (
    <div className="bg-white flex justify-center items-center shadow-sm h-50 w-full rounded-lg">
      <div className="flex items-center justify-center flex-col">
        <Image src="/no-money.webp" alt="" height={100} width={100}></Image>

        <p className="text-sm mt-2">You have not made any payment. </p>
      </div>
    </div>
  );
}
