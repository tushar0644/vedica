"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  LayoutDashboard,
  FileText,
  User,
  MessageCircleQuestion,
  KeyRound,
  LogOut,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useAccountStore } from "@/store/user.store";
import { logout } from "@/actions/auth/logout";

export default function ApplicationHeader() {
  const { data: user } = useAccountStore();
  const menuItems = [
    {
      label: "My Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "All Form(s)",
      href: "/dashboard/applications",
      icon: FileText,
    },
    {
      label: "My Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      label: "My Queries",
      href: "/dashboard/queries",
      icon: MessageCircleQuestion,
    },
    {
      label: "Change Password",
      href: "/dashboard/change-password",
      icon: KeyRound,
    },
    {
      label: "Logout",
      href: "",
      onClick: async () => {
        console.log("hello");
        await logout();
        window.location.href = "/";
      },
      icon: LogOut,
    },
  ];
  return (
    <header className=" border-b border-[#d7d7d7] bg-white">
      <div className="flex h-14 items-center justify-between">
        {/* LEFT LOGO */}
        <div className="flex h-full items-center border-r border-[#d7d7d7] px-4">
          <Link href="#">
            <Image
              src="/sidebar-logo.webp"
              alt="Logo"
              width={42}
              height={42}
              className="object-contain"
            />
          </Link>
        </div>

        {/* RIGHT MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              disabled={!user}
              type="button"
              className="
                flex h-full items-center gap-2 border-l border-[#d7d7d7]
                pl-5 text-[15px] font-semibold text-[#4b4b4b]
                hover:bg-[#f7f7f7] w-[200px]
              "
            >
              Welcome {user?.first_name}
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-[200px] rounded-none border-[#d7d7d7] p-0"
          >
            {menuItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <DropdownMenuItem
                  key={index}
                  onSelect={async (e) => {
                    e.preventDefault();

                    if (item.onClick) {
                      await item.onClick();
                    }
                  }}
                  className="
    rounded-none border-b border-[#ececec] p-0
    last:border-b-0
  "
                >
                  {item.onClick ? (
                    <div
                      className="
        flex w-full items-center gap-3 px-4 py-3
        text-[#4b4b4b] cursor-pointer
      "
                    >
                      <Icon className="h-4 w-4" />
                      <p className="text-xs">{item.label}</p>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="
        flex w-full items-center gap-3 px-4 py-3
        text-[#4b4b4b]
      "
                    >
                      <Icon className="h-4 w-4" />
                      <p className="text-xs">{item.label}</p>
                    </Link>
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
