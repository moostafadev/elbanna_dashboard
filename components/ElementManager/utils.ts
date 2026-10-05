import {
  COLOR_OPTIONS,
  SIZE_MAP,
  ELEMENT_TYPES,
  LIST_ELEMENT_TYPES,
  DEFAULT_VALUES,
  CLOUDINARY_UPLOAD_PRESET,
  MAX_IMAGE_SIZE_MB,
  MESSAGES,
} from "./constants";
import type { ParsedElement } from "./types";

type OffsetBias = "start" | "end";

const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const SAFE_URL_PATTERN = /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;

const LIST_MARKER_PATTERN = /^(?:[*-](?:\s+|$)|•\s*|[\d٠-٩]+[.)](?:\s+|$))/;

export const isListType = (type: string): boolean =>
  LIST_ELEMENT_TYPES.includes(type);

export const escapeHTML = (text: string): string =>
  text.replace(/[&<>"']/g, (char) => ESCAPE_MAP[char]);

export const sanitizeUrl = (url: string): string => {
  const trimmed = url.trim();
  return SAFE_URL_PATTERN.test(trimmed) ? trimmed : "";
};

export const parseListText = (text: string): string[] => {
  if (!text) return [];

  return text
    .split("\n")
    .map((line) => line.trim().replace(LIST_MARKER_PATTERN, "").trim())
    .filter((line) => line.length > 0);
};

export const hasElementContent = ({
  type,
  displayText,
  href,
}: ParsedElement): boolean => {
  if (type === "img") return sanitizeUrl(href) !== "";
  if (isListType(type)) return parseListText(displayText).length > 0;
  return displayText.trim() !== "";
};

export const isElementValid = (element: ParsedElement): boolean => {
  if (!hasElementContent(element)) return false;
  if (element.type === "a") return sanitizeUrl(element.href) !== "";
  return true;
};

export const parseHTML = (html: string): ParsedElement => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const element = doc.body.firstElementChild;

  if (!element) return { ...DEFAULT_VALUES };

  const tagName = element.tagName.toLowerCase();
  const type = ELEMENT_TYPES.includes(tagName) ? tagName : "p";
  const classes = Array.from(element.classList);

  const color =
    classes.find((cls) =>
      COLOR_OPTIONS.some((option) => option.value === cls),
    ) ?? DEFAULT_VALUES.color;

  const space =
    classes.find((cls) => cls.startsWith("mt-")) ?? DEFAULT_VALUES.space;

  const base = { type, color, space, href: "", openNewTab: true };

  if (type === "img") {
    const alt = element.getAttribute("alt") ?? "";
    return {
      ...base,
      displayText: alt,
      formattedText: escapeHTML(alt),
      href: element.getAttribute("src") ?? "",
    };
  }

  if (isListType(type)) {
    const displayText = Array.from(element.querySelectorAll("li"))
      .map((li) => li.textContent ?? "")
      .join("\n");

    return { ...base, displayText, formattedText: escapeHTML(displayText) };
  }

  const displayText = element.textContent ?? "";
  const formattedText = element.innerHTML;

  if (type === "a") {
    return {
      ...base,
      displayText,
      formattedText,
      href: element.getAttribute("href") ?? "",
      openNewTab: element.getAttribute("target") === "_blank",
    };
  }

  return { ...base, displayText, formattedText };
};

export const generatePreviewHTML = ({
  type,
  color,
  space,
  displayText,
  formattedText,
  href,
  openNewTab,
}: ParsedElement): string => {
  if (type === "img") {
    const src = sanitizeUrl(href);
    if (!src) return "";
    return `<img src="${escapeHTML(src)}" class="max-w-full h-auto ${space}" alt="${escapeHTML(displayText)}" />`;
  }

  const classNames = [SIZE_MAP[type], color, space].filter(Boolean).join(" ");

  if (type === "a") {
    const safeHref = sanitizeUrl(href) || "#";
    const target = openNewTab
      ? ` target="_blank" rel="noopener noreferrer"`
      : "";
    return `<a href="${escapeHTML(safeHref)}" class="${classNames}"${target}>${formattedText}</a>`;
  }

  if (isListType(type)) {
    const items = parseListText(displayText)
      .map((item) => `<li>${escapeHTML(item)}</li>`)
      .join("");
    return `<${type} class="${classNames}">${items}</${type}>`;
  }

  return `<${type} class="${classNames}">${formattedText}</${type}>`;
};

export const validateImageFile = (file: File): string | null => {
  if (!file.type.startsWith("image/")) return MESSAGES.onlyImages;
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024)
    return MESSAGES.imageTooLarge;
  return null;
};

export const uploadImage = async (file: File): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data: { secure_url: string } = await response.json();
  return data.secure_url;
};

/* ---------- DOM helpers (formatting without breaking the HTML structure) ---------- */

const locateOffset = (
  root: DocumentFragment,
  offset: number,
  bias: OffsetBias,
): { node: Node; offset: number } => {
  const walker = root.ownerDocument.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
  );
  let remaining = offset;
  let lastText: Text | null = null;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const length = node.data.length;

    if (bias === "end" ? remaining <= length : remaining < length) {
      return { node, offset: remaining };
    }

    remaining -= length;
    lastText = node;
  }

  return lastText
    ? { node: lastText, offset: lastText.data.length }
    : { node: root, offset: 0 };
};

const loadFragment = (
  html: string,
  expectedText: string,
): HTMLTemplateElement => {
  const template = document.createElement("template");
  template.innerHTML = html;

  if (template.content.textContent !== expectedText) {
    template.innerHTML = escapeHTML(expectedText);
  }

  return template;
};

const cleanFragment = (root: DocumentFragment) => {
  root.querySelectorAll("*").forEach((el) => {
    if (!el.textContent) el.remove();
  });
  root.normalize();
};

const createFormatWrapper = (doc: Document, className: string): HTMLElement => {
  switch (className) {
    case "font-bold":
      return doc.createElement("strong");
    case "italic":
      return doc.createElement("em");
    case "underline":
      return doc.createElement("u");
    default: {
      const span = doc.createElement("span");
      span.className = className;
      return span;
    }
  }
};

export const wrapSelection = (
  formattedText: string,
  displayText: string,
  start: number,
  end: number,
  className: string,
): string => {
  if (start >= end) return formattedText;

  const template = loadFragment(formattedText, displayText);
  const root = template.content;
  const range = root.ownerDocument.createRange();
  const from = locateOffset(root, start, "start");
  const to = locateOffset(root, end, "end");

  range.setStart(from.node, from.offset);
  range.setEnd(to.node, to.offset);

  const wrapper = createFormatWrapper(root.ownerDocument, className);
  wrapper.appendChild(range.extractContents());
  range.insertNode(wrapper);
  cleanFragment(root);

  return template.innerHTML;
};

export const syncFormattedText = (
  formattedText: string,
  previousText: string,
  nextText: string,
): string => {
  if (!formattedText.includes("<")) return escapeHTML(nextText);

  const maxPrefix = Math.min(previousText.length, nextText.length);
  let prefix = 0;
  while (prefix < maxPrefix && previousText[prefix] === nextText[prefix]) {
    prefix++;
  }

  const maxSuffix = maxPrefix - prefix;
  let suffix = 0;
  while (
    suffix < maxSuffix &&
    previousText[previousText.length - 1 - suffix] ===
      nextText[nextText.length - 1 - suffix]
  ) {
    suffix++;
  }

  const inserted = nextText.slice(prefix, nextText.length - suffix);
  const template = loadFragment(formattedText, previousText);
  const root = template.content;
  const range = root.ownerDocument.createRange();
  const from = locateOffset(root, prefix, "end");
  const to = locateOffset(root, previousText.length - suffix, "end");

  range.setStart(from.node, from.offset);
  range.setEnd(to.node, to.offset);
  range.deleteContents();

  if (inserted) {
    range.insertNode(root.ownerDocument.createTextNode(inserted));
  }

  cleanFragment(root);

  return root.textContent === nextText
    ? template.innerHTML
    : escapeHTML(nextText);
};
