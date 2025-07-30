"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { sidebarSelectItem } from "./manageSidebar";
import { SidebarItem } from "./types";
import { usePathname } from "next/navigation";

const SidebarItemNav = ({
  item,
  open,
}: {
  item: SidebarItem;
  open: boolean;
}) => {
  const pathname = usePathname();

  return (
    <Link
      className={cn(
        "py-3 px-4 flex items-center gap-2 sm:text-lg font-semibold duration-300",
        open ? "" : "justify-center",
        sidebarSelectItem(pathname, item.href)
      )}
      href={item.href}
    >
      {item.icon}
      {open ? <span>{item.label}</span> : null}
    </Link>
  );
};

export default SidebarItemNav;
