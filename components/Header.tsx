import { User } from "lucide-react";

import { cn } from "@/lib/utils";
import React from "react";

const Header = ({ open }: { open: boolean }) => {
  return (
    <header
      className={cn(
        "mr-14 p-4 h-16 duration-300 flex items-center justify-end",
        open ? "md:mr-64" : "md:mr-20"
      )}
    >
      <User />
    </header>
  );
};

export default Header;
