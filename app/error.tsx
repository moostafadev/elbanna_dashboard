"use client";

import React, { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <p className="text-lg font-semibold">حدث خطأ غير متوقع</p>
      <Button onClick={reset} className="text-white">
        إعادة المحاولة
      </Button>
    </div>
  );
};

export default ErrorPage;
