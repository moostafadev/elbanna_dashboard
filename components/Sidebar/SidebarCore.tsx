import React from "react";
import { sidebarOpenCore, sidebarOpenToggle } from "./manageSidebar";
import Image from "next/image";
import { sidebarData } from "./data";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { SidebarToggleButton } from "./SidebarToggleButton";
import { SidebarOverlay } from "./SidebarOverlay";
import SidebarItemNav from "./SidebarItem";
import Link from "next/link";

const SidebarCore = ({ open }: { open: boolean }) => {
  return (
    <>
      <SidebarOverlay open={open} />

      <aside
        className={cn(
          "fixed top-0 right-0 h-full shadow-md flex flex-col gap-4 bg-background duration-300 z-20",
          sidebarOpenCore(open)
        )}
      >
        {/* Toggle button */}
        <SidebarToggleButton
          className={cn(
            "text-primary/60 hover:bg-primary/10 bg-primary/20 hover:text-primary/70 absolute top-2 w-10 h-10 flex items-center justify-center p-0 duration-300 transition-[right]",
            sidebarOpenToggle(open)
          )}
        />

        {/* Header */}
        <Link
          href={"/"}
          className="flex items-center justify-center py-4 mx-3 border-b border-b-gray-300"
        >
          <Image
            src={"/logo.png"}
            alt="Logo"
            width={40}
            height={40}
            priority={true}
            className="max-w-20 w-full"
          />
        </Link>

        {/* Items */}
        <nav>
          <ul className="flex flex-col gap-2">
            {sidebarData.map((item) => (
              <li key={item.href} className="w-full">
                <SidebarItemNav item={item} open={open} />
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 absolute bottom-4 right-0 w-full h-fit">
          <Button className="w-full text-red-600 hover:bg-red-50 bg-red-100 hover:text-red-700 flex items-center gap-2">
            <LogOut />
            {open && <span>تسجيل خروج</span>}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default SidebarCore;
