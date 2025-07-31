"use client";

import { usePathname } from "next/navigation";
import { setSidebarOpen } from "@/lib/sidebar-actions";
import { cn } from "@/lib/utils";
import { sidebarOpenOverlay } from "./manageSidebar";
import { useTransition } from "react";

export const SidebarOverlay = ({ open }: { open: boolean }) => {
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const handleClose = () => {
    startTransition(async () => {
      await setSidebarOpen(false, pathname);
    });
  };

  return (
    <div
      className={cn(
        "md:hidden fixed h-full bg-gray-100 z-10 left-0 top-0 duration-300 w-[20%]",
        sidebarOpenOverlay(open)
      )}
      onClick={handleClose}
    />
  );
};
