"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

interface IProps {
  html: string;
  index: number;
  onUpdate: (index: number, newHtml: string) => void;
  onCancel: () => void;
}

const EditElement = ({ html, index, onUpdate, onCancel }: IProps) => {
  const [type, setType] = useState("p");
  const [color, setColor] = useState("black");
  const [space, setSpace] = useState("mt-2");
  const [displayText, setDisplayText] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [href, setHref] = useState("");
  const [openNewTab, setOpenNewTab] = useState(true);
  const [loading, setLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse HTML to extract data
  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const element = doc.body.firstElementChild;

    if (element) {
      const tagName = element.tagName.toLowerCase();
      setType(tagName);

      const classes = element.className.split(" ");

      // Extract color
      const colorClass = classes.find(
        (cls) =>
          cls.startsWith("text-") &&
          !cls.includes("text-xl") &&
          !cls.includes("text-lg") &&
          !cls.includes("text-base") &&
          !cls.includes("text-sm") &&
          !cls.includes("text-2xl") &&
          !cls.includes("text-3xl") &&
          !cls.includes("text-4xl")
      );
      if (colorClass) {
        setColor(colorClass.replace("text-", ""));
      }

      // Extract spacing
      const spaceClass = classes.find((cls) => cls.startsWith("mt-"));
      if (spaceClass) {
        setSpace(spaceClass);
      }

      if (tagName === "img") {
        setHref(element.getAttribute("src") || "");
        setDisplayText(element.getAttribute("alt") || "");
        setFormattedText(element.getAttribute("alt") || "");
      } else if (tagName === "a") {
        setHref(element.getAttribute("href") || "");
        setDisplayText(element.textContent || "");
        setFormattedText(element.innerHTML || "");
        setOpenNewTab(element.getAttribute("target") === "_blank");
      } else {
        setDisplayText(element.textContent || "");
        setFormattedText(element.innerHTML || "");
      }
    }
  }, [html]);

  // Update preview when any field changes
  useEffect(() => {
    generatePreview();
  }, [type, color, space, displayText, formattedText, href, openNewTab]);

  const generatePreview = () => {
    const sizeMap: Record<string, string> = {
      h1: "text-4xl font-bold",
      h2: "text-3xl font-semibold",
      h3: "text-2xl font-semibold",
      h4: "text-xl font-semibold",
      h5: "text-lg font-semibold",
      h6: "text-base font-semibold",
      p: "text-base",
      a: "text-base underline",
    };

    const size = sizeMap[type] || "";
    let preview = "";

    if (type === "img") {
      preview = `<img src="${href}" class="${space}" alt="${displayText}" style="max-width: 300px;" />`;
    } else if (type === "a") {
      preview = `<a href="${href}" class="${size} text-${color} ${space}"${
        openNewTab ? ` target="_blank" rel="noopener noreferrer"` : ""
      }>${formattedText}</a>`;
    } else {
      preview = `<${type} class="${size} text-${color} ${space}">${formattedText}</${type}>`;
    }

    setPreviewHtml(preview);
  };

  const handleSubmit = () => {
    let newHtml = "";

    const sizeMap: Record<string, string> = {
      h1: "text-4xl font-bold",
      h2: "text-3xl font-semibold",
      h3: "text-2xl font-semibold",
      h4: "text-xl font-semibold",
      h5: "text-lg font-semibold",
      h6: "text-base font-semibold",
      p: "text-base",
      a: "text-base underline",
    };

    const size = sizeMap[type] || "";

    if (type === "img") {
      newHtml = `<img src="${href}" class="${space}" alt="${displayText}" style="max-width: 300px;" />`;
    } else if (type === "a") {
      newHtml = `<a href="${href}" class="${size} text-${color} ${space}"${
        openNewTab ? ` target="_blank" rel="noopener noreferrer"` : ""
      }>${formattedText}</a>`;
    } else {
      newHtml = `<${type} class="${size} text-${color} ${space}">${formattedText}</${type}>`;
    }

    onUpdate(index, newHtml);
  };

  const onUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("فقط الصور مسموح بها");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "elbanna");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      setHref(data.secure_url);
    } catch (err) {
      console.error("Upload error:", err);
      alert("حدث خطأ أثناء رفع الصورة");
    } finally {
      setLoading(false);
    }
  };

  const formatSelection = (formatType: string) => {
    const el = type === "p" ? textAreaRef.current : inputRef.current;
    if (!el) return;

    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const selected = displayText.slice(start, end);

    if (!selected) return;

    const before = displayText.slice(0, start);
    const after = displayText.slice(end);

    // إنشاء HTML tags بدلاً من class attributes
    let htmlWrapper = "";
    const plainText = selected;

    switch (formatType) {
      case "font-bold":
        htmlWrapper = `<strong>${selected}</strong>`;
        break;
      case "italic":
        htmlWrapper = `<em>${selected}</em>`;
        break;
      case "underline":
        htmlWrapper = `<u>${selected}</u>`;
        break;
      case "text-center block w-full":
        htmlWrapper = `<div style="text-align: center; display: block; width: 100%;">${selected}</div>`;
        break;
      default:
        htmlWrapper = `<span class="${formatType}">${selected}</span>`;
    }

    // تحديث النص المعروض (بدون HTML tags)
    const newDisplayText = before + plainText + after;
    setDisplayText(newDisplayText);

    // تحديث النص المنسق (مع HTML tags)
    const beforeFormatted = formattedText.substring(
      0,
      getFormattedPosition(start)
    );
    const afterFormatted = formattedText.substring(getFormattedPosition(end));
    const newFormattedText = beforeFormatted + htmlWrapper + afterFormatted;
    setFormattedText(newFormattedText);

    // إعادة تعيين موضع الكورسور
    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = (before + plainText).length;
    }, 0);
  };

  // دالة مساعدة لحساب الموضع في النص المنسق
  const getFormattedPosition = (plainPosition: number) => {
    // إذا كان النص المنسق والعادي متماثلين، فالموضع هو نفسه
    if (formattedText === displayText) {
      return plainPosition;
    }

    // إذا كان هناك تنسيق، نحتاج لحساب الموضع الصحيح
    let plainCount = 0;
    let formattedCount = 0;

    while (
      plainCount < plainPosition &&
      formattedCount < formattedText.length
    ) {
      if (formattedText[formattedCount] === "<") {
        // تخطي HTML tag
        while (
          formattedCount < formattedText.length &&
          formattedText[formattedCount] !== ">"
        ) {
          formattedCount++;
        }
        formattedCount++; // تخطي >
      } else {
        plainCount++;
        formattedCount++;
      }
    }

    return formattedCount;
  };

  const handleTextChange = (newText: string) => {
    setDisplayText(newText);
    setFormattedText(newText);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent
        dir="rtl"
        className="max-h-[90vh] overflow-y-auto max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>تعديل العنصر</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="نوع العنصر" />
            </SelectTrigger>
            <SelectContent>
              {["p", "h1", "h2", "h3", "h4", "h5", "h6", "a", "img"].map(
                (t) => (
                  <SelectItem key={t} value={t}>
                    {t.toUpperCase()}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          {/* Preview Section */}
          <div className="border rounded p-3 bg-gray-50">
            <h4 className="text-sm font-medium mb-2">معاينة:</h4>
            <div
              className="min-h-[40px] bg-white p-2 rounded border"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>

          {type !== "img" && (
            <>
              {type === "p" ? (
                <textarea
                  ref={textAreaRef}
                  rows={4}
                  dir="rtl"
                  className="w-full border rounded p-2 text-sm"
                  placeholder="نص العنصر"
                  value={displayText}
                  onChange={(e) => handleTextChange(e.target.value)}
                />
              ) : (
                <Input
                  ref={inputRef}
                  dir="rtl"
                  placeholder="نص العنصر"
                  value={displayText}
                  onChange={(e) => handleTextChange(e.target.value)}
                />
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatSelection("font-bold")}
                >
                  عريض
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatSelection("italic")}
                >
                  مائل
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatSelection("underline")}
                >
                  تحته خط
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => formatSelection("text-center block w-full")}
                >
                  توسيط
                </Button>
              </div>
            </>
          )}

          {type === "img" ? (
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                اختر صورة من جهازك
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={onUploadImage}
                disabled={loading}
              />
              {loading && (
                <p className="text-sm text-blue-500">جاري الرفع...</p>
              )}
              {href && (
                <Image
                  width={300}
                  height={200}
                  src={href}
                  alt="معاينة الصورة"
                  className="max-w-xs mt-2 rounded border"
                />
              )}
              <Input
                placeholder="النص البديل (alt)"
                value={displayText}
                onChange={(e) => handleTextChange(e.target.value)}
              />
            </div>
          ) : type === "a" ? (
            <Input
              placeholder="رابط (href)"
              value={href}
              onChange={(e) => setHref(e.target.value)}
            />
          ) : null}

          {type === "a" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="new-tab"
                checked={openNewTab}
                onCheckedChange={(v) => setOpenNewTab(!!v)}
              />
              <label htmlFor="new-tab" className="text-sm">
                فتح في صفحة جديدة
              </label>
            </div>
          )}

          {type !== "img" && (
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue placeholder="لون النص" />
              </SelectTrigger>
              <SelectContent>
                {["primary", "black", "green", "red", "blue"].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={space} onValueChange={setSpace}>
            <SelectTrigger>
              <SelectValue placeholder="الهامش العلوي (mt-)" />
            </SelectTrigger>
            <SelectContent>
              {[
                { value: "mt-0", label: "بدون هامش" },
                { value: "mt-1", label: "هامش صغير" },
                { value: "mt-2", label: "هامش متوسط" },
                { value: "mt-4", label: "هامش كبير" },
                { value: "mt-6", label: "هامش كبير جداً" },
                { value: "mt-8", label: "أقصى هامش" },
              ].map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button onClick={onCancel} variant="outline">
            إلغاء
          </Button>
          <Button onClick={handleSubmit} className="text-white">
            تحديث
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditElement;
