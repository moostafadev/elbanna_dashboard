import type { LANG, Status } from "@prisma/client";

export interface BlogFormValues {
  title: string;
  desc: string;
  category: string;
  keywords: string;
  image: string;
  status: Status;
  lang: LANG | "";
  content: string[];
}

export interface BlogFormProps {
  mode: "create" | "edit";
  blogId?: string;
  initialValues?: BlogFormValues;
}

export type StepIndex = 0 | 1 | 2;

export type FieldChange = <K extends keyof BlogFormValues>(
  key: K,
  value: BlogFormValues[K],
) => void;
