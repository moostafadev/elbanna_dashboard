import React, { memo } from "react";
import { Badge } from "@/components/ui/badge";
import BlogContent from "../BlogContent";
import BlogImage from "../BlogImage";
import BlogStatusBadge from "../BlogStatusBadge";
import { LANG_LABELS } from "../constants";
import type { BlogFormValues } from "./types";
import { parseKeywords } from "./utils";

const ReviewStep = ({
  values,
  dir,
}: {
  values: BlogFormValues;
  dir: "rtl" | "ltr";
}) => {
  const keywords = parseKeywords(values.keywords);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        راجع البيانات والمحتوى قبل الحفظ.
      </p>

      {values.image && (
        <BlogImage
          src={values.image}
          alt={values.title}
          variant="cover"
          className="max-w-2xl rounded-lg border"
        />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="blue">{values.category}</Badge>
        {values.lang !== "" && (
          <Badge variant="secondary">{LANG_LABELS[values.lang]}</Badge>
        )}
        <BlogStatusBadge status={values.status} />
      </div>

      <div dir={dir} className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">{values.title}</h2>
        <p className="text-gray-600">{values.desc}</p>
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <Badge key={keyword} variant="outline">
              {keyword}
            </Badge>
          ))}
        </div>
      )}

      <div className="rounded-lg border bg-gray-50 p-3 md:p-4">
        <h3 className="mb-2 text-sm font-medium">
          المحتوى ({values.content.length} عنصر):
        </h3>
        <div className="rounded border bg-white p-3">
          <BlogContent content={values.content} dir={dir} />
        </div>
      </div>
    </div>
  );
};

export default memo(ReviewStep);
