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
        "md:hidden fixed h-full bg-gray-50 z-10 left-0",
        sidebarOpenOverlay(open)
      )}
      onClick={handleClose}
    />
  );
};
