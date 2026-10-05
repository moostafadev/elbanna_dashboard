import type { LANG, Status } from "@prisma/client";

export const LANG_LABELS: Record<LANG, string> = {
  ar: "العربية",
  en: "الإنجليزية",
  fr: "الفرنسية",
};

export const STATUS_LABELS: Record<Status, string> = {
  show: "مرئي",
  archive: "مؤرشف",
};

export const LANG_OPTIONS = (Object.keys(LANG_LABELS) as LANG[]).map(
  (value) => ({
    value,
    label: LANG_LABELS[value],
  }),
);

export const STATUS_OPTIONS = (Object.keys(STATUS_LABELS) as Status[]).map(
  (value) => ({
    value,
    label: STATUS_LABELS[value],
  }),
);

export const getLangDir = (lang: LANG | ""): "rtl" | "ltr" =>
  lang === "" || lang === "ar" ? "rtl" : "ltr";
