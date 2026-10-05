import React from "react";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
    <FileQuestion className="h-12 w-12 text-gray-400" />
    <p className="text-lg font-semibold">الصفحة أو المدونة غير موجودة</p>
    <Button asChild className="text-white">
      <Link href="/blogs">العودة للمدونات</Link>
    </Button>
  </div>
);

export default NotFound;
