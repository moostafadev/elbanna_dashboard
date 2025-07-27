"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { memo } from "react";

const CustomSelect = ({
  value,
  onValueChange,
  items,
  placeholder,
  className,
}: {
  value?: string;
  onValueChange: (value: string) => void;
  items: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) => {
  return (
    <Select value={value} onValueChange={onValueChange} dir="rtl">
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder ?? ""} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default memo(CustomSelect);
