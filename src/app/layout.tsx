import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import "react-phone-number-input/style.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/provider/query.provider";
import { Toaster } from "sonner";
import { SITE_TITLE_SUFFIX } from "@/constants/metadata";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SITE_TITLE_SUFFIX}`,
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body>
        <TooltipProvider>
          <QueryProvider>{children}</QueryProvider>
        </TooltipProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
