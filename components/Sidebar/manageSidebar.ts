export const sidebarOpenCore = (open: boolean) => {
  return open ? "w-[80%] md:w-64" : "w-14 md:w-20";
};

export const sidebarOpenOverlay = (open: boolean) => {
  return open ? "w-[20%]" : "w-0";
};

export const sidebarOpenToggle = (open: boolean) => {
  return open ? "right-[264px]" : "right-[64px] md:right-[88px]";
};

export const sidebarSelectItem = (pathname: string, href: string) => {
  return pathname === href
    ? "bg-primary text-white shadow-md"
    : "bg-white text-primary shadow-sm";
};
