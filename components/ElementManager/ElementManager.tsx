"use client";

import React, { useState, useRef, useCallback } from "react";
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

import { ElementManagerProps } from "./types";
import {
  ELEMENT_TYPES,
  COLOR_OPTIONS,
  SPACING_OPTIONS,
  FORMAT_BUTTONS,
  LIST_ELEMENT_TYPES,
} from "./constants";
import {
  useElementState,
  useImageHandler,
  useTextFormatter,
  usePreviewHTML,
} from "./hooks";
import { parseListText } from "./utils";

const ElementManager: React.FC<ElementManagerProps> = ({
  setResult,
  html,
  index,
  onUpdate,
  onCancel,
  mode,
}) => {
  const [open, setOpen] = useState(mode === "edit");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { state, updateState, resetState } = useElementState(mode, html);

  const { handleImageUpload } = useImageHandler(updateState);

  const { formatSelection } = useTextFormatter(
    state,
    updateState,
    mode,
    textAreaRef,
    inputRef
  );

  const previewHtml = usePreviewHTML(state);

  const handleSubmit = useCallback(() => {
    if (mode === "create" && setResult) {
      setResult((prev) => [...prev, previewHtml]);
      resetState();
      setOpen(false);
    } else if (mode === "edit" && onUpdate && index !== undefined) {
      onUpdate(index, previewHtml);
    }
  }, [mode, setResult, onUpdate, index, previewHtml, resetState]);

  const handleCancel = useCallback(() => {
    if (mode === "create") {
      setOpen(false);
    } else if (mode === "edit" && onCancel) {
      onCancel();
    }
  }, [mode, onCancel]);

  const handleTextChange = useCallback(
    (value: string) => {
      if (LIST_ELEMENT_TYPES.includes(state.type)) {
        const items = parseListText(value);
        updateState({
          displayText: value,
          formattedText: mode === "edit" ? value : state.formattedText,
          listItems: items,
        });
      } else {
        updateState({
          displayText: value,
          formattedText: mode === "edit" ? value : state.formattedText,
        });
      }
    },
    [updateState, mode, state.formattedText, state.type]
  );

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("فقط الصور مسموح بها");
        return;
      }

      await handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const getElementTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      p: "فقرة",
      h1: "عنوان رئيسي",
      h2: "عنوان فرعي",
      h3: "عنوان فرعي 2",
      h4: "عنوان فرعي 3",
      h5: "عنوان فرعي 4",
      h6: "عنوان فرعي 5",
      a: "رابط",
      img: "صورة",
      ul: "قائمة نقطية",
      ol: "قائمة مرقمة",
    };
    return labels[type] || type.toUpperCase();
  };

  const getPlaceholderText = () => {
    if (LIST_ELEMENT_TYPES.includes(state.type)) {
      return state.type === "ul"
        ? "أدخل عناصر القائمة، كل عنصر في سطر منفصل:\n* العنصر الأول\n* العنصر الثاني\n* العنصر الثالث"
        : "أدخل عناصر القائمة، كل عنصر في سطر منفصل:\n1. العنصر الأول\n2. العنصر الثاني\n3. العنصر الثالث";
    }
    return "نص العنصر";
  };

  const dialogContent = (
    <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {mode === "create" ? "إنشاء عنصر" : "تعديل العنصر"}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <Select
          value={state.type}
          onValueChange={(value) => updateState({ type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="نوع العنصر" />
          </SelectTrigger>
          <SelectContent>
            {ELEMENT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {getElementTypeLabel(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="border rounded p-3 bg-gray-50">
          <h4 className="text-sm font-medium mb-2">معاينة:</h4>
          <div
            className="min-h-[40px] bg-white p-2 rounded border"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>

        {state.type !== "img" && (
          <>
            {state.type === "p" || LIST_ELEMENT_TYPES.includes(state.type) ? (
              <textarea
                ref={textAreaRef}
                rows={LIST_ELEMENT_TYPES.includes(state.type) ? 6 : 4}
                dir="rtl"
                className="w-full border rounded p-2 text-sm"
                placeholder={getPlaceholderText()}
                value={state.displayText}
                onChange={(e) => handleTextChange(e.target.value)}
              />
            ) : (
              <Input
                ref={inputRef}
                dir="rtl"
                placeholder="نص العنصر"
                value={state.displayText}
                onChange={(e) => handleTextChange(e.target.value)}
              />
            )}

            {!LIST_ELEMENT_TYPES.includes(state.type) && (
              <div className="flex flex-wrap gap-2">
                {FORMAT_BUTTONS.map((btn) => (
                  <Button
                    key={btn.className}
                    size="sm"
                    variant="outline"
                    onClick={() => formatSelection(btn.className)}
                  >
                    {btn.label}
                  </Button>
                ))}
              </div>
            )}
          </>
        )}

        {state.type === "img" && (
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              اختر صورة من جهازك
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={state.loading}
            />
            {state.loading && (
              <p className="text-sm text-blue-500">جاري الرفع...</p>
            )}
            {state.href && (
              <Image
                width={500}
                height={500}
                src={state.href}
                alt="معاينة الصورة"
                className="max-w-xs mt-2 rounded border"
              />
            )}
            <Input
              placeholder="النص البديل (alt)"
              value={state.displayText}
              onChange={(e) => updateState({ displayText: e.target.value })}
            />
          </div>
        )}

        {state.type === "a" && (
          <>
            <Input
              placeholder="رابط (href)"
              value={state.href}
              onChange={(e) => updateState({ href: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <Checkbox
                id="new-tab"
                checked={state.openNewTab}
                onCheckedChange={(checked) =>
                  updateState({ openNewTab: !!checked })
                }
              />
              <label htmlFor="new-tab" className="text-sm">
                فتح في صفحة جديدة
              </label>
            </div>
          </>
        )}

        {state.type !== "img" && (
          <Select
            value={state.color}
            onValueChange={(value) => updateState({ color: value })}
            dir="rtl"
          >
            <SelectTrigger>
              <SelectValue placeholder="لون النص" />
            </SelectTrigger>
            <SelectContent>
              {COLOR_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={state.space}
          onValueChange={(value) => updateState({ space: value })}
          dir="rtl"
        >
          <SelectTrigger>
            <SelectValue placeholder="الهامش العلوي" />
          </SelectTrigger>
          <SelectContent>
            {SPACING_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button onClick={handleCancel} variant="outline">
          إلغاء
        </Button>
        <Button onClick={handleSubmit} className="text-white">
          {mode === "create" ? "إضافة" : "تحديث"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  if (mode === "edit") {
    return (
      <Dialog open={true} onOpenChange={handleCancel}>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">[+] إضافة عنصر</Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
};

export default ElementManager;
