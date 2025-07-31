import React from "react";
import SidebarCore from "./Sidebar/SidebarCore";
import { getSidebarState } from "@/lib/sidebar-actions";
import { cn } from "@/lib/utils";
import Header from "./Header/Header";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const sidebarOpen = await getSidebarState();

  return (
    <>
      <Header open={sidebarOpen} />
      <SidebarCore open={sidebarOpen} />
      <main
        className={cn(
          "!mr-16 m-2 p-4 duration-300 rounded-md shadow-sm hover:shadow-md bg-white min-h-[calc(100vh-64px-16px)]",
          sidebarOpen ? "md:!mr-[264px]" : "md:!mr-[88px]"
        )}
      >
        {children}
      </main>
    </>
  );
};

export default MainLayout;
