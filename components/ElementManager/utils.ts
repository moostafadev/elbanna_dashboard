import { COLOR_OPTIONS, SIZE_MAP, LIST_ELEMENT_TYPES } from "./constants";
import { ParsedElement } from "./types";

export const parseHTML = (html: string): ParsedElement => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const element = doc.body.firstElementChild;

  if (!element) {
    return {
      type: "p",
      color: "text-black",
      space: "mt-2",
      displayText: "",
      formattedText: "",
      href: "",
      openNewTab: true,
      listItems: [],
    };
  }

  const tagName = element.tagName.toLowerCase();
  const classes = element.className.split(" ").filter(Boolean);

  const colorClass =
    classes.find((cls) =>
      COLOR_OPTIONS.some((option) => option.value === cls)
    ) || "text-black";

  const spaceClass = classes.find((cls) => cls.startsWith("mt-")) || "mt-2";

  if (tagName === "img") {
    return {
      type: tagName,
      color: colorClass,
      space: spaceClass,
      displayText: element.getAttribute("alt") || "",
      formattedText: element.getAttribute("alt") || "",
      href: element.getAttribute("src") || "",
      openNewTab: true,
      listItems: [],
    };
  }

  if (tagName === "a") {
    return {
      type: tagName,
      color: colorClass,
      space: spaceClass,
      displayText: element.textContent || "",
      formattedText: element.innerHTML || "",
      href: element.getAttribute("href") || "",
      openNewTab: element.getAttribute("target") === "_blank",
      listItems: [],
    };
  }

  // معالجة القوائم
  if (LIST_ELEMENT_TYPES.includes(tagName)) {
    const listItems = Array.from(element.querySelectorAll("li")).map(
      (li) => li.innerHTML || ""
    );
    const displayText = Array.from(element.querySelectorAll("li"))
      .map((li) => li.textContent || "")
      .join("\n");

    return {
      type: tagName,
      color: colorClass,
      space: spaceClass,
      displayText,
      formattedText: displayText,
      href: "",
      openNewTab: true,
      listItems,
    };
  }

  return {
    type: tagName,
    color: colorClass,
    space: spaceClass,
    displayText: element.textContent || "",
    formattedText: element.innerHTML || "",
    href: "",
    openNewTab: true,
    listItems: [],
  };
};

export const generatePreviewHTML = (
  type: string,
  color: string,
  space: string,
  displayText: string,
  formattedText: string,
  href: string,
  openNewTab: boolean,
  listItems: string[] = []
): string => {
  const size = SIZE_MAP[type] || "";

  if (type === "img") {
    return `<img src="${href}" class="max-w-full h-auto ${space}" alt="${displayText}" />`;
  }

  if (type === "a") {
    return `<a href="${href}" class="${size} ${color} ${space}"${
      openNewTab ? ` target="_blank" rel="noopener noreferrer"` : ""
    }>${formattedText}</a>`;
  }

  // معالجة القوائم
  if (LIST_ELEMENT_TYPES.includes(type)) {
    const listItemsHTML = listItems.map((item) => `<li>${item}</li>`).join("");
    return `<${type} class="${size} ${color} ${space}">${listItemsHTML}</${type}>`;
  }

  return `<${type} class="${size} ${color} ${space}">${formattedText}</${type}>`;
};

export const uploadImage = async (file: File): Promise<string> => {
  if (!file.type.startsWith("image/")) {
    throw new Error("فقط الصور مسموح بها");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "elbanna");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data.secure_url;
};

export const getFormattedPosition = (
  plainPosition: number,
  formattedText: string,
  displayText: string
): number => {
  if (formattedText === displayText) return plainPosition;

  let plainCount = 0;
  let formattedCount = 0;

  while (plainCount < plainPosition && formattedCount < formattedText.length) {
    if (formattedText[formattedCount] === "<") {
      while (
        formattedText[formattedCount] !== ">" &&
        formattedCount < formattedText.length
      ) {
        formattedCount++;
      }
      formattedCount++;
    } else {
      plainCount++;
      formattedCount++;
    }
  }

  return formattedCount;
};

export const applyFormatting = (
  className: string,
  selectedText: string
): string => {
  switch (className) {
    case "font-bold":
      return `<strong>${selectedText}</strong>`;
    case "italic":
      return `<em>${selectedText}</em>`;
    case "underline":
      return `<u>${selectedText}</u>`;
    case "text-center block w-full":
      return `<div style="text-align: center; display: block; width: 100%;">${selectedText}</div>`;
    default:
      return `<span class="${className}">${selectedText}</span>`;
  }
};

export const parseListText = (text: string): string[] => {
  if (!text) return [];

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      line = line.replace(/^[*•-]\s*/, "");
      line = line.replace(/^\d+\.\s*/, "");
      return line;
    });
};
