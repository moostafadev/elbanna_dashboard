export const sidebarOpenCore = (open: boolean) => {
  return open ? "w-[80%] md:w-64" : "w-14 md:w-20";
};

export const sidebarOpenOverlay = (open: boolean) => {
  return open ? "opacity-80" : "opacity-0 -z-10";
};

export const sidebarOpenToggle = (open: boolean) => {
  return open
    ? "right-[calc(100%+8px)] md:right-[264px]"
    : "right-[64px] md:right-[88px]";
};

export const sidebarSelectItem = (pathname: string, href: string) => {
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return isActive
    ? "bg-primary text-white shadow-md"
    : "bg-white text-primary shadow-sm";
};
