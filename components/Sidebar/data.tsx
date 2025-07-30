import { FileText, Info, LayoutDashboard, Settings } from "lucide-react";

export const sidebarData = [
  {
    href: "/",
    label: "لوحة التحكم",
    icon: <LayoutDashboard />,
  },
  {
    href: "/blogs",
    label: "المدونة",
    icon: <FileText />,
  },
  {
    href: "/faqs",
    label: "الاسئلة الشائعة",
    icon: <Info />,
  },
  {
    href: "/settings",
    label: "الاعدادات",
    icon: <Settings />,
  },
];
