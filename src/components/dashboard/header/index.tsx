"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { menuItems } from "@/constants/ui";
import QueriesModal from "../queries/query-modal";
import { Menu } from "lucide-react";
import { useMenu } from "@/provider/menu.provider";
import { useAccountStore } from "@/store/user.store";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/auth/logout";

export default function Header() {
  const pathname = usePathname();
  const { toggle } = useMenu();
  const { data: user } = useAccountStore();
  const currentPage = menuItems.find((item) => pathname === item.href);
  const { data } = useAccountStore();
  return (
    <header className="flex h-16 md:h-20 w-full items-center justify-between border-b px-4 md:px-8">
      <div>
        <h1 className=" text-lg md:text-2xl font-bold tracking-tight">
          {currentPage?.label || "Dashboard"}
        </h1>

        <p className="text-xs md:text-sm text-muted-foreground">
          Welcome <strong>{data?.first_name}</strong>
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* <div className="p-2 bg-white">
          <p className="text-[10px] uppercase tracking-wide ">
            Assigned Counsellor
          </p>

          <p className="mt-1 text-sm font-semibold capitalize">
            {user?.custom_assigned_counsellor_name || "-"}
          </p>

          {user?.custom_select_assigned_counsellor_email && (
            <a
              href={`mailto:${user.custom_select_assigned_counsellor_email}`}
              className=" block break-all text-sm "
            >
              {user.custom_select_assigned_counsellor_email}
            </a>
          )}

          {user?.custom_assigned_counsellor_phone && (
            <a
              href={`tel:${user.custom_assigned_counsellor_phone}`}
              className="block text-sm "
            >
              {user.custom_assigned_counsellor_phone}
            </a>
          )}
        </div> */}
        <button
          onClick={() => toggle()}
          className="flex h-6 md:h-8 w-6 md:w-8 md:hidden items-center justify-center text-base transition hover:bg-muted"
        >
          <Menu></Menu>
        </button>

        <QueriesModal>
          <button className="flex h-6 md:h-8 w-6 md:w-8 items-center justify-center  border border-base text-base transition hover:bg-muted">
            <span className="text-xl font-bold">?</span>
          </button>
        </QueriesModal>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 md:h-10 w-8 md:w-10 items-center justify-center rounded-full border-2 border-base text-xs md:text-sm font-bold text-base outline-none">
              {`${data?.first_name?.[0] ?? ""}${data?.last_name?.[0] ?? ""}`.toUpperCase()}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/profile"
                className="cursor-pointer text-xs!"
              >
                My Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/change-password"
                className="cursor-pointer text-xs!"
              >
                Change Password
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer text-red-500 focus:text-red-500 text-xs!"
              onClick={async () => {
                await logout();
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/";
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
