import { cn } from "@/lib/utils"; // Adjust this import to match your project structure

type TCOLOR = "primary" | "black" | "green" | "red" | "blue";
type TYPE = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "a";

const createText = (
  text: string,
  space: string,
  color?: TCOLOR,
  type: TYPE = "p",
  href?: string
): HTMLElement => {
  const el = document.createElement(type);

  // Tailwind style map for headings and text
  const typeStyles: Record<TYPE, string> = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-semibold",
    h3: "text-2xl font-semibold",
    h4: "text-xl font-medium",
    h5: "text-lg font-medium",
    h6: "text-base font-medium",
    p: "text-base",
    a: "text-base underline text-blue-600 hover:text-blue-800",
  };

  // Tailwind color mapping
  const colorMap: Record<TCOLOR, string> = {
    primary: "text-primary",
    black: "text-black",
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
  };

  // Combine all classes using `cn`
  el.className = cn(typeStyles[type], space, color ? colorMap[color] : null);

  // If anchor tag, set href and best practices
  if (type === "a") {
    el.setAttribute("href", href || "#");
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  }

  el.textContent = text;
  return el;
};

export default createText;
