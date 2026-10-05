"use client";

import React, { memo, useCallback, useTransition } from "react";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/auth.actions";
import { stroke_width } from "@/constants/styles";

const LogoutButton = ({ showLabel = true }: { showLabel?: boolean }) => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = useCallback(() => {
    startTransition(async () => {
      await logout();
    });
  }, []);

  return (
    <Button
      onClick={handleLogout}
      disabled={isPending}
      title="تسجيل خروج"
      aria-label="تسجيل خروج"
      className="flex w-full items-center gap-2 bg-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      {isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <LogOut strokeWidth={stroke_width} />
      )}
      {showLabel && <span>تسجيل خروج</span>}
    </Button>
  );
};

export default memo(LogoutButton);
