"use client";
import {
  FileText,
  CreditCard,
  MessageSquare,
  Mail,
  HelpCircle,
  Landmark,
  Briefcase,
  BookOpen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "@/constants/ui";
import { useMenu } from "@/provider/menu.provider";
import { useAccountStore } from "@/store/user.store";

function _Sidebar({ onClick }: { onClick: Function }) {
  const pathname = usePathname();
  const { data: user } = useAccountStore();
  return (
    <>
      <aside className="flex h-full w-55 flex-col bg-base">
        <Link href={"/dashboard"}>
          <Image
            alt={""}
            height={150}
            width={150}
            src={"/sidebar-logo.webp"}
            className="mx-auto mt-6"
          ></Image>
        </Link>

        <nav className="flex-1 px-4 py-6">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  onClick={() => onClick()}
                >
                  <button
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#1B2C75] text-white shadow"
                        : "hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="p-2 bg-white">
          <p className="text-[10px] uppercase tracking-wide ">
            Assigned Counsellor
          </p>

          <p className="mt-2 text-sm font-semibold capitalize">
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
        </div>
      </aside>
    </>
  );
}

export default function Sidebar() {
  const { isOpen, close } = useMenu();
  return (
    <>
      <div
        onClick={() => close()}
        className={`z-150 bg-black/20 absolute h-screen w-screen  ${isOpen ? "md:hidden block" : "hidden"}`}
      ></div>
      <div
        className={`${isOpen ? "max-w-55" : "max-w-0"} md:hidden block overflow-hidden shadow-md sm:shadow-none z-200 transition-all duration-300 h-screen absolute top-0 left-0 `}
      >
        <_Sidebar onClick={() => close()} />
      </div>

      <div className={` hidden md:block h-screen `}>
        <_Sidebar onClick={() => {}} />
      </div>
    </>
  );
}
