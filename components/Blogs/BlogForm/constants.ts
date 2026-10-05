import type { BlogFormValues } from "./types";

export const DEFAULT_FORM_VALUES: BlogFormValues = {
  title: "",
  desc: "",
  category: "",
  keywords: "",
  image: "",
  status: "show",
  lang: "",
  content: [],
};

export const STEPS = [
  { title: "البيانات الأساسية" },
  { title: "المحتوى" },
  { title: "المراجعة والحفظ" },
] as const;

export const FORM_MESSAGES = {
  created: "تم إنشاء المدونة بنجاح",
  updated: "تم تحديث المدونة بنجاح",
  saveFailed: "فشل حفظ المدونة، حاول مرة أخرى",
  fillRequired: "أكمل الحقول المطلوبة أولاً",
  contentRequired: "أضف عنصراً واحداً على الأقل إلى المحتوى",
} as const;

export const SERVER_ERRORS: Record<string, string> = {
  "A blog with this title already exists": "توجد مدونة بنفس العنوان بالفعل",
  "Blog not found": "المدونة غير موجودة",
  "Missing required fields": "بعض الحقول المطلوبة ناقصة",
  "Content must not be empty": "المحتوى لا يمكن أن يكون فارغاً",
};
