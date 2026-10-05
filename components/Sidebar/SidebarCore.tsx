import React from "react";
import { sidebarOpenCore, sidebarOpenToggle } from "./manageSidebar";
import Image from "next/image";
import { sidebarData } from "./data";
import { cn } from "@/lib/utils";
import { SidebarToggleButton } from "./SidebarToggleButton";
import { SidebarOverlay } from "./SidebarOverlay";
import SidebarItemNav from "./SidebarItem";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

const SidebarCore = ({ open }: { open: boolean }) => {
  return (
    <>
      <SidebarOverlay open={open} />

      <aside
        className={cn(
          "fixed top-0 right-0 h-full shadow-sm flex flex-col gap-4 bg-background duration-300 z-20",
          sidebarOpenCore(open),
        )}
      >
        {/* Toggle button */}
        <SidebarToggleButton
          open={open}
          className={cn(
            "text-primary/60 hover:bg-primary/20 bg-primary/10 hover:text-primary/70 absolute top-3 w-10 h-10 flex items-center justify-center p-0 duration-300 transition-[right]",
            sidebarOpenToggle(open),
          )}
        />

        {/* Header */}
        <Link
          href={"/"}
          className="flex items-center justify-center py-4 mx-1 md:mx-3 border-b border-b-gray-300"
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
        <div className="px-2 md:px-4 absolute bottom-4 right-0 w-full h-fit">
          <LogoutButton showLabel={open} />
        </div>
      </aside>
    </>
  );
};

export default SidebarCore;
