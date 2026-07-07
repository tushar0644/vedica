import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import React, { ReactNode } from "react";

import { SITE_TITLE_SUFFIX } from "@/constants/metadata";
import { Metadata } from "next";
import { Footer } from "@/components/dashboard/footer";
import { QueryStore } from "@/store/query.store";
export const metadata: Metadata = {
  title: `Dashboard | ${SITE_TITLE_SUFFIX}`,
};

export default function layout({ children }: { children: ReactNode }) {
  return (
    <QueryStore>
      <section className="flex  overflow-hidden h-screen ">
        <Sidebar></Sidebar>
        <article className="flex flex-1 overflow-hidden flex-col">
          <Header></Header>
          <div className="overflow-hidden relative  flex-1 border">
            <div className="absolute h-full w-full p-2 md:p-4 bg-muted top-0 left-0 overflow-y-auto">
              {children}
            </div>
          </div>
          <Footer></Footer>
        </article>
      </section>
    </QueryStore>
  );
}
