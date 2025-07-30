"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setSidebarOpen(open: boolean, currentPath: string = "/") {
  const cookieStore = cookies();
  cookieStore.set("sidebar-open", open.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  revalidatePath(currentPath);
}

export async function toggleSidebar(currentPath: string = "/") {
  const cookieStore = cookies();
  const currentState = cookieStore.get("sidebar-open")?.value === "true";
  await setSidebarOpen(!currentState, currentPath);
}

export async function getSidebarState(): Promise<boolean> {
  const cookieStore = cookies();
  return cookieStore.get("sidebar-open")?.value === "true";
}
