import React from "react";
import { redirect } from "next/navigation";
import { CircleUser, Clock, Mail, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth/guard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LogoutButton from "@/components/Sidebar/LogoutButton";

export const dynamic = "force-dynamic";

const Page = async () => {
  const session = await getSession();

  if (!session) redirect("/login");

  const rows = [
    {
      label: "البريد الإلكتروني",
      icon: Mail,
      value: <span dir="ltr">{session.email}</span>,
    },
    {
      label: "الصلاحية",
      icon: ShieldCheck,
      value: <Badge variant="green">مدير النظام</Badge>,
    },
    {
      label: "تنتهي الجلسة في",
      icon: Clock,
      value: session.expiresAt.toLocaleString("ar-EG", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Africa/Cairo",
      }),
    },
  ];

  return (
    <section className="mx-auto max-w-xl space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-xl">
            <CircleUser className="h-5 w-5 text-primary" />
            الملف الشخصي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 rounded-lg border bg-gray-50 p-3 text-sm"
            >
              <span className="flex items-center gap-2 text-gray-500">
                <row.icon className="h-4 w-4" />
                {row.label}
              </span>
              <span className="font-medium text-gray-900">{row.value}</span>
            </div>
          ))}
          <div className="pt-2">
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;
