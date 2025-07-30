import React from "react";
import SidebarCore from "./Sidebar/SidebarCore";
import { getSidebarState } from "@/lib/sidebar-actions";
import { cn } from "@/lib/utils";
import Header from "./Header";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const sidebarOpen = await getSidebarState();

  return (
    <>
      <Header open={sidebarOpen} />
      <SidebarCore open={sidebarOpen} />
      <main
        className={cn(
          "mr-0 p-4 duration-300",
          sidebarOpen ? "md:mr-64" : "md:mr-20"
        )}
      >
        {children}
      </main>
    </>
  );
};

export default MainLayout;
