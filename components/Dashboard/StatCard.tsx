import React from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const StatCard = ({
  title,
  value,
  hint,
  icon: Icon,
  color,
  bgColor,
}: StatCardProps) => (
  <Card className="relative overflow-hidden transition-shadow duration-300 hover:shadow-lg">
    <CardContent className="p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {value.toLocaleString("ar-EG")}
          </p>
          <p className="mt-2 text-xs text-gray-500">{hint}</p>
        </div>
        <div className={`rounded-full p-3 ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
