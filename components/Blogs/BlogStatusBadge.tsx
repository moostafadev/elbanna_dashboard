import React from "react";
import type { Status } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_LABELS } from "./constants";

const BlogStatusBadge = ({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) => (
  <Badge
    variant={status === "show" ? "green" : "secondary"}
    className={cn("text-xs", className)}
  >
    {STATUS_LABELS[status]}
  </Badge>
);

export default BlogStatusBadge;
