"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { CircleUser, User, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { stroke_width } from "@/constants/styles";
import Link from "next/link";

const UserToggle = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        size={"icon"}
        variant={"outline"}
      >
        <User className="!w-5 !h-5" strokeWidth={stroke_width} />
      </Button>
      <div
        ref={menuRef}
        className={cn(
          "p-4 fixed top-[72px] left-4 w-fit h-fit bg-white shadow-md duration-300 flex flex-col gap-2 border rounded-md",
          open ? "opacity-100 z-10" : "opacity-0 -z-10 pointer-events-none"
        )}
      >
        <Link href={"/profile"}>
          <Button
            className="flex items-center gap-2 w-full justify-start"
            variant={"secondary"}
          >
            <CircleUser strokeWidth={stroke_width} />
            <span>صفحة المستخدم</span>
          </Button>
        </Link>
        <Link href={"/user"}>
          <Button
            className="flex items-center gap-2 w-full justify-start"
            variant={"ghost"}
          >
            <UserPlus strokeWidth={stroke_width} />
            <span>اضافة مستخدم</span>
          </Button>
        </Link>
      </div>
    </>
  );
};

export default UserToggle;
