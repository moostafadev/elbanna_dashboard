export const ELEMENT_TYPES = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "img",
  "ul",
  "ol",
];

export const SIZE_MAP: Record<string, string> = {
  h1: "text-4xl font-bold",
  h2: "text-3xl font-semibold",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-semibold",
  h5: "text-lg font-semibold",
  h6: "text-base font-semibold",
  p: "text-base",
  a: "text-base underline",
  ul: "text-base list-disc list-inside",
  ol: "text-base list-decimal list-inside",
};

export const COLOR_OPTIONS = [
  { value: "text-primary", label: "الاساسي" },
  { value: "text-black", label: "اسود" },
  { value: "text-green-600", label: "اخضر" },
  { value: "text-red-600", label: "احمر" },
  { value: "text-blue-600", label: "ازرق" },
];

export const SPACING_OPTIONS = [
  { value: "mt-0", label: "بدون هامش" },
  { value: "mt-1", label: "هامش صغير" },
  { value: "mt-2", label: "هامش متوسط" },
  { value: "mt-4", label: "هامش كبير" },
  { value: "mt-6", label: "هامش كبير جداً" },
  { value: "mt-8", label: "أقصى هامش" },
];

export const FORMAT_BUTTONS = [
  { label: "عريض", className: "font-bold" },
  { label: "مائل", className: "italic" },
  { label: "تحته خط", className: "underline" },
  { label: "توسيط", className: "text-center block w-full" },
];

export const DEFAULT_VALUES = {
  type: "p",
  color: "text-black",
  space: "mt-2",
  displayText: "",
  formattedText: "",
  href: "",
  openNewTab: true,
  listItems: [],
};

export const LIST_ELEMENT_TYPES = ["ul", "ol"];
