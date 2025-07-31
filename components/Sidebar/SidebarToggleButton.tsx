"use client";

import { usePathname } from "next/navigation";
import { toggleSidebar } from "@/lib/sidebar-actions";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useTransition } from "react";
import { stroke_width } from "@/constants/styles";

export const SidebarToggleButton = ({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) => {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleSidebar(pathname);
    });
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={isPending}
      size={"icon"}
      className={className}
    >
      {open ? (
        <X className="!w-5 !h-5" strokeWidth={stroke_width} />
      ) : (
        <Menu className="!w-5 !h-5" strokeWidth={stroke_width} />
      )}
    </Button>
  );
};
