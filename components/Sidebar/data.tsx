import { stroke_width } from "@/constants/styles";
import { FileText, Info, LayoutDashboard, Settings } from "lucide-react";

export const sidebarData = [
  {
    href: "/",
    label: "لوحة التحكم",
    icon: <LayoutDashboard strokeWidth={stroke_width} />,
  },
  {
    href: "/blogs",
    label: "المدونة",
    icon: <FileText strokeWidth={stroke_width} />,
  },
  {
    href: "/faqs",
    label: "الاسئلة الشائعة",
    icon: <Info strokeWidth={stroke_width} />,
  },
  {
    href: "/settings",
    label: "الاعدادات",
    icon: <Settings strokeWidth={stroke_width} />,
  },
];
