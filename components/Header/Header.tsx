import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import UserToggle from "./UserToggle";

const Header = ({ open }: { open: boolean }) => {
  return (
    <header
      className={cn(
        "mr-14 p-4 pr-14 h-16 duration-300 flex items-center justify-between bg-white shadow-sm",
        open ? "md:mr-64" : "md:mr-20"
      )}
    >
      <Link href={"/"} className="sm:text-lg md:text-xl font-bold text-primary">
        مكتب أحمد البنا
      </Link>
      <UserToggle />
    </header>
  );
};

export default Header;
