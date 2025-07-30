"use client";

import { usePathname } from "next/navigation";
import { toggleSidebar } from "@/lib/sidebar-actions";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useTransition } from "react";

export const SidebarToggleButton = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleSidebar(pathname);
    });
  };

  return (
    <Button onClick={handleToggle} disabled={isPending} className={className}>
      <Menu />
    </Button>
  );
};
