import React, { ReactNode } from "react";
import { MenuProvider } from "@/provider/menu.provider";
import { Footer } from "@/components/dashboard/footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GeoStore } from "@/store/geo.store";
export default function layout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <MenuProvider>
        <GeoStore countryCode="IN">
          <main className="max-w-480 mx-auto">{children}</main>
        </GeoStore>
      </MenuProvider>
    </TooltipProvider>
  );
}
