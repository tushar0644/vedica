import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NoSlot() {
  return (
    <div className="bg-white flex justify-center items-center shadow-sm h-50 w-full rounded-lg">
      <div className="flex items-center justify-center flex-col gap-4">
        <Image src="/no-slot.png" alt="" height={50} width={50}></Image>

        <p className="text">Sorry! No Slot is available for this process.</p>
        <Link href="/dashboard">
          <Button className="bg-base hover:bg-base">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
