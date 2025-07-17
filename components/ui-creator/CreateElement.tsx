"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
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
  setResult: React.Dispatch<React.SetStateAction<string[]>>;
}

const CreateElement = ({ setResult }: IProps) => {
  const [open, setOpen] = useState(false);
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

  // Update preview when any field changes
  useEffect(() => {
    generatePreview();
  }, [type, color, space, formattedText, href, openNewTab]);

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
      preview = `<img src="${href}" class="max-w-full h-auto ${space}" alt="${displayText}" />`;
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
    let html = "";

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
      html = `<img src="${href}" class="max-w-full h-auto ${space}" alt="${displayText}" />`;
    } else if (type === "a") {
      html = `<a href="${href}" class="${size} text-${color} ${space}"${
        openNewTab ? ` target="_blank" rel="noopener noreferrer"` : ""
      }>${formattedText}</a>`;
    } else {
      html = `<${type} class="${size} text-${color} ${space}">${formattedText}</${type}>`;
    }

    setResult((prev) => [...prev, html]);
    setOpen(false);

    // Reset
    setDisplayText("");
    setFormattedText("");
    setHref("");
    setType("p");
    setColor("black");
    setSpace("mt-2");
    setOpenNewTab(true);
    setPreviewHtml("");
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

  const formatSelection = (className: string) => {
    if (type === "p") {
      const el = textAreaRef.current;
      if (!el) return;

      const start = el.selectionStart;
      const end = el.selectionEnd;

      const selected = displayText.slice(start, end);
      if (!selected) return;

      const before = displayText.slice(0, start);
      const after = displayText.slice(end);

      const wrapped = `<span class="${className}">${selected}</span>`;
      const plainWrapped = selected;

      setDisplayText(before + plainWrapped + after);
      setFormattedText(
        formattedText.slice(0, start) + wrapped + formattedText.slice(end)
      );

      setTimeout(() => {
        el.focus();
        el.selectionStart = el.selectionEnd = (before + plainWrapped).length;
      }, 0);
    } else {
      const el = inputRef.current;
      if (!el) return;

      const start = el.selectionStart || 0;
      const end = el.selectionEnd || 0;

      const selected = displayText.slice(start, end);
      if (!selected) return;

      const before = displayText.slice(0, start);
      const after = displayText.slice(end);

      const wrapped = `<span class="${className}">${selected}</span>`;
      const plainWrapped = selected;

      setDisplayText(before + plainWrapped + after);
      setFormattedText(
        formattedText.slice(0, start) + wrapped + formattedText.slice(end)
      );

      setTimeout(() => {
        el.focus();
        el.selectionStart = el.selectionEnd = (before + plainWrapped).length;
      }, 0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">[+] إضافة عنصر</Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إنشاء عنصر</DialogTitle>
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
                  onChange={(e) => {
                    setDisplayText(e.target.value);
                    setFormattedText(e.target.value);
                  }}
                />
              ) : (
                <Input
                  ref={inputRef}
                  dir="rtl"
                  placeholder="نص العنصر"
                  value={displayText}
                  onChange={(e) => {
                    setDisplayText(e.target.value);
                    setFormattedText(e.target.value);
                  }}
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
                  width={500}
                  height={500}
                  src={href}
                  alt="معاينة الصورة"
                  className="max-w-xs mt-2 rounded border"
                />
              )}
              <Input
                placeholder="النص البديل (alt)"
                value={displayText}
                onChange={(e) => {
                  setDisplayText(e.target.value);
                  setFormattedText(e.target.value);
                }}
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
            <div className="flex items-center gap-2">
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
          <Button onClick={handleSubmit} className="text-white">
            إضافة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateElement;
