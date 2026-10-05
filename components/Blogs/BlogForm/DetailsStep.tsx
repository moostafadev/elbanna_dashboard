"use client";

import React, { memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CustomSelect from "@/components/Custom/Select/CustomSelect";
import InputImage from "@/components/Custom/Inputs/InputImage";
import type { ElementState } from "@/components/ElementManager";
import type { LANG, Status } from "@prisma/client";
import { IMAGE_SIZES } from "@/constants/images";
import BlogImage from "../BlogImage";
import { LANG_OPTIONS, STATUS_OPTIONS } from "../constants";
import type { BlogFormValues, FieldChange } from "./types";

interface DetailsStepProps {
  values: BlogFormValues;
  dir: "rtl" | "ltr";
  uploading: boolean;
  setField: FieldChange;
  setUploading: (value: boolean) => void;
}

const DetailsStep = ({
  values,
  dir,
  uploading,
  setField,
  setUploading,
}: DetailsStepProps) => {
  const handleImageState = useCallback(
    (updates: Partial<ElementState>) => {
      if (updates.href !== undefined) setField("image", updates.href);
      if (updates.loading !== undefined) setUploading(updates.loading);
    },
    [setField, setUploading],
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="blog-lang">اللغة *</Label>
        <CustomSelect
          value={values.lang}
          onValueChange={(value) => setField("lang", value as LANG)}
          items={LANG_OPTIONS}
          placeholder="اختر اللغة"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-status">الحالة</Label>
        <CustomSelect
          value={values.status}
          onValueChange={(value) => setField("status", value as Status)}
          items={STATUS_OPTIONS}
          className="w-full"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="blog-title">العنوان *</Label>
        <Input
          id="blog-title"
          dir={dir}
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
          placeholder="عنوان المدونة"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="blog-desc">الوصف *</Label>
        <Textarea
          id="blog-desc"
          dir={dir}
          rows={3}
          value={values.desc}
          onChange={(e) => setField("desc", e.target.value)}
          placeholder="وصف مختصر يظهر في القوائم ومحركات البحث"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-category">الفئة *</Label>
        <Input
          id="blog-category"
          dir={dir}
          value={values.category}
          onChange={(e) => setField("category", e.target.value)}
          placeholder="مثال: قانون العمل"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="blog-keywords">الكلمات المفتاحية</Label>
        <Input
          id="blog-keywords"
          dir={dir}
          value={values.keywords}
          onChange={(e) => setField("keywords", e.target.value)}
          placeholder="افصل بين الكلمات بفاصلة"
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label>صورة الغلاف *</Label>
        <InputImage updateState={handleImageState} loading={uploading} />
        <p className="text-xs text-muted-foreground">
          الأبعاد المثالية {IMAGE_SIZES.cover.width}×{IMAGE_SIZES.cover.height}،
          وسيتم قص الصورة تلقائيًا لتناسب هذه النسبة.
        </p>
        {uploading && <p className="text-sm text-blue-500">جاري الرفع...</p>}
        {values.image && (
          <BlogImage
            src={values.image}
            alt="صورة الغلاف"
            variant="cover"
            className="mt-2 max-w-sm rounded-lg border"
          />
        )}
      </div>
    </div>
  );
};

export default memo(DetailsStep);
