"use client";

import React, { memo } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBlogForm } from "./hooks";
import StepIndicator from "./StepIndicator";
import DetailsStep from "./DetailsStep";
import ReviewStep from "./ReviewStep";
import type { BlogFormProps } from "./types";

const StepLoader = () => (
  <div className="flex h-40 items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);

const ContentStep = dynamic(() => import("./ContentStep"), {
  loading: StepLoader,
});

const BlogForm = (props: BlogFormProps) => {
  const {
    values,
    step,
    uploading,
    isPending,
    dir,
    setField,
    setContent,
    setUploading,
    goNext,
    goBack,
    goTo,
    handleSubmit,
  } = useBlogForm(props);
  const isLast = step === 2;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-white p-4 shadow-sm md:p-6">
        <h1 className="text-xl font-bold text-gray-900 md:text-3xl">
          {props.mode === "edit" ? "تعديل المدونة" : "إنشاء مدونة جديدة"}
        </h1>
        <StepIndicator step={step} onSelect={goTo} />
      </section>

      <Card>
        <CardContent className="p-4 md:p-6">
          {step === 0 && (
            <DetailsStep
              values={values}
              dir={dir}
              uploading={uploading}
              setField={setField}
              setUploading={setUploading}
            />
          )}
          {step === 1 && (
            <ContentStep
              content={values.content}
              dir={dir}
              setContent={setContent}
            />
          )}
          {step === 2 && <ReviewStep values={values} dir={dir} />}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={step === 0 || isPending}
          className="gap-2"
        >
          <ArrowRight size={16} />
          السابق
        </Button>

        {isLast ? (
          <Button
            onClick={handleSubmit}
            disabled={isPending || uploading}
            className="gap-2 text-white"
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isPending
              ? "جاري الحفظ..."
              : props.mode === "edit"
                ? "حفظ التعديلات"
                : "نشر المدونة"}
          </Button>
        ) : (
          <Button
            onClick={goNext}
            disabled={uploading}
            className="gap-2 text-white"
          >
            التالي
            <ArrowLeft size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(BlogForm);
