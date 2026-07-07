import InstructionSection from "@/components/home/instruction";
import Hero from "@/components/home/hero";
import Header from "@/components/home/header";
import { SITE_TITLE_SUFFIX } from "@/constants/metadata";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${SITE_TITLE_SUFFIX}`,
};
export default function Page() {
  return (
    <>
      <Header></Header>
      <Hero></Hero>

      <InstructionSection></InstructionSection>
    </>
  );
}
