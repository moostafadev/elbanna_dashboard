"use client";

import React, { useState, useRef, useCallback, memo } from "react";
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

import { ElementManagerProps, ElementState } from "./types";
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
import CustomDialog from "../Custom/Dialog/CustomDialog";
import { Textarea } from "../ui/textarea";
import { Plus } from "lucide-react";

const getElementTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    p: "فقرة",
    h1: "عنوان رئيسي",
    h2: "عنوان فرعي 1",
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

const getPlaceholderText = (type: string) => {
  if (LIST_ELEMENT_TYPES.includes(type)) {
    return type === "ul"
      ? "أدخل عناصر القائمة، كل عنصر في سطر منفصل:\n* العنصر الأول\n* العنصر الثاني\n* العنصر الثالث"
      : "أدخل عناصر القائمة، كل عنصر في سطر منفصل:\n1. العنصر الأول\n2. العنصر الثاني\n3. العنصر الثالث";
  }
  return "نص العنصر";
};

const ElementType = memo(
  ({
    updateState,
    type,
  }: {
    updateState: (updates: Partial<ElementState>) => void;
    type: string;
  }) => {
    return (
      <Select
        value={type}
        onValueChange={(value) => updateState({ type: value })}
        dir="rtl"
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
    );
  }
);

ElementType.displayName = "ElementType";

const FormatButtons = memo(
  ({ formatSelection }: { formatSelection: (className: string) => void }) => (
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
  )
);

FormatButtons.displayName = "FormatButtons";

const TeaxtareaOrInput = memo(
  ({
    type,
    textAreaRef,
    dir,
    displayText,
    inputRef,
    mode,
    updateState,
    formattedText,
  }: {
    type: string;
    textAreaRef: React.RefObject<HTMLTextAreaElement>;
    dir: "rtl" | "ltr";
    displayText: string;
    inputRef: React.RefObject<HTMLInputElement>;
    mode: "edit" | "create";
    updateState: (updates: Partial<ElementState>) => void;
    formattedText: string;
  }) => {
    const handleTextChange = useCallback(
      (value: string) => {
        if (LIST_ELEMENT_TYPES.includes(type)) {
          const items = parseListText(value);
          updateState({
            displayText: value,
            formattedText: mode === "edit" ? value : formattedText,
            listItems: items,
          });
        } else {
          updateState({
            displayText: value,
            formattedText: mode === "edit" ? value : formattedText,
          });
        }
      },
      [updateState, mode, formattedText, type]
    );
    if (type === "p" || LIST_ELEMENT_TYPES.includes(type)) {
      return (
        <Textarea
          ref={textAreaRef}
          rows={LIST_ELEMENT_TYPES.includes(type) ? 6 : 4}
          dir={dir}
          className="w-full border rounded p-2 text-sm"
          placeholder={getPlaceholderText(type)}
          value={displayText}
          onChange={(e) => handleTextChange(e.target.value)}
        />
      );
    } else {
      return (
        <Input
          ref={inputRef}
          dir={dir}
          placeholder="نص العنصر"
          value={displayText}
          onChange={(e) => handleTextChange(e.target.value)}
        />
      );
    }
  }
);

TeaxtareaOrInput.displayName = "TeaxtareaOrInput";

const ElementManager: React.FC<ElementManagerProps> = ({
  setResult,
  html,
  index,
  onUpdate,
  onCancel,
  mode,
  dir,
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

  const dialogContent = (
    <>
      <div className="flex flex-col gap-4">
        <ElementType type={state.type} updateState={updateState} />

        <div className="border rounded p-3 bg-gray-50">
          <h4 className="text-sm font-medium mb-2">معاينة:</h4>
          <div
            className="min-h-[40px] bg-white p-2 rounded border"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
            dir={dir}
          />
        </div>

        {state.type !== "img" && (
          <>
            <TeaxtareaOrInput
              type={state.type}
              textAreaRef={textAreaRef}
              dir={dir}
              displayText={state.displayText}
              inputRef={inputRef}
              mode={mode}
              formattedText={state.formattedText}
              updateState={updateState}
            />

            {!LIST_ELEMENT_TYPES.includes(state.type) && (
              <FormatButtons formatSelection={formatSelection} />
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
    </>
  );

  if (mode === "edit") {
    return (
      <CustomDialog
        open={true}
        onOpenChange={handleCancel}
        title="تعديل العنصر"
        footer={
          <>
            <Button onClick={handleCancel} variant="outline">
              إلغاء
            </Button>
            <Button onClick={handleSubmit} className="text-white">
              تحديث
            </Button>
          </>
        }
      >
        {dialogContent}
      </CustomDialog>
    );
  }

  return (
    <CustomDialog
      open={open}
      onOpenChange={setOpen}
      title="إنشاء عنصر"
      trigger={
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Plus /> إضافة عنصر
        </Button>
      }
      footer={
        <>
          <Button onClick={handleCancel} variant="outline">
            إلغاء
          </Button>
          <Button onClick={handleSubmit} className="text-white">
            إضافة
          </Button>
        </>
      }
    >
      {dialogContent}
    </CustomDialog>
  );
};

export default memo(ElementManager);
