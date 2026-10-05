import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSafeRedirect } from "@/lib/auth/redirect";
import LoginForm from "@/components/Auth/LoginForm";

const Page = ({
  searchParams,
}: {
  searchParams: { from?: string | string[] };
}) => {
  const from =
    typeof searchParams.from === "string" ? searchParams.from : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="items-center gap-2 text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            priority
            className="w-full max-w-20"
          />
          <CardTitle className="text-xl md:text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>مكتب أحمد البنا - لوحة التحكم</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm redirectTo={getSafeRedirect(from)} />
        </CardContent>
      </Card>
    </main>
  );
};

export default Page;
