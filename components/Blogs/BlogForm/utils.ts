import type { LANG } from "@prisma/client";
import type { CreateBlogInput } from "@/types/blog";
import { FORM_MESSAGES, SERVER_ERRORS } from "./constants";
import type { BlogFormValues, StepIndex } from "./types";

export const parseKeywords = (text: string): string[] =>
  Array.from(
    new Set(
      text
        .split(/[,،\n]/)
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    ),
  );

export const keywordsToText = (keywords: string[]): string =>
  keywords.join("، ");

export const isDetailsValid = (values: BlogFormValues): boolean =>
  [values.title, values.desc, values.category, values.image].every(
    (field) => field.trim() !== "",
  ) && values.lang !== "";

export const isContentValid = (values: BlogFormValues): boolean =>
  values.content.length > 0;

export const isStepValid = (
  step: StepIndex,
  values: BlogFormValues,
): boolean => {
  if (step === 0) return isDetailsValid(values);
  if (step === 1) return isContentValid(values);
  return true;
};

export const getStepError = (step: StepIndex): string =>
  step === 1 ? FORM_MESSAGES.contentRequired : FORM_MESSAGES.fillRequired;

export const toBlogInput = (
  values: BlogFormValues,
  lang: LANG,
): CreateBlogInput & { lang: LANG } => ({
  title: values.title.trim(),
  desc: values.desc.trim(),
  category: values.category.trim(),
  keywords: parseKeywords(values.keywords),
  image: values.image,
  status: values.status,
  lang,
  content: values.content,
});

export const translateError = (error: string): string =>
  SERVER_ERRORS[error] ?? FORM_MESSAGES.saveFailed;
