"use client";

import Link from "next/link";

import {
  FaFacebookF as Facebook,
  FaInstagram as Instagram,
  FaYoutube as Youtube,
} from "react-icons/fa";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/TheVedicaScholarsProgrammeforWomen/",
    icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/vedicascholars",
    icon: Instagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@vedica.scholars",
    icon: Youtube,
  },
];

export function Footer() {
  return (
    <footer className="rounded-md border bg-[#e9e9e9] px-2.5 py-2">
      <div className="flex items-center justify-end gap-3">
        {socialLinks.map((item) => {
          const Icon = item.icon;

          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full border bg-white transition-colors hover:bg-[#f5f5f5]"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              </TooltipTrigger>

              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </footer>
  );
}
