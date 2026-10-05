"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error("[admin error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="h-12 w-12 text-red-400" />
      <p className="text-lg font-semibold">حدث خطأ غير متوقع</p>
      <p className="text-sm text-muted-foreground">
        حاول مرة أخرى، وإذا استمرت المشكلة حدّث الصفحة.
      </p>
      <Button onClick={reset} className="gap-2 text-white">
        <RefreshCcw size={16} />
        إعادة المحاولة
      </Button>
    </div>
  );
};

export default Error;
