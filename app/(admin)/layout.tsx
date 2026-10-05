import React from "react";
import { redirect } from "next/navigation";
import MainLayout from "@/components/MainLayout";
import { isAdmin } from "@/lib/auth/guard";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdmin())) redirect("/login");

  return <MainLayout>{children}</MainLayout>;
}
