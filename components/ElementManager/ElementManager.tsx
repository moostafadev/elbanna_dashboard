"use client";

import React, { useState, useRef, useCallback, memo } from "react";
import { Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

import { ElementManagerProps } from "./types";
import {
  ELEMENT_TYPES,
  COLOR_OPTIONS,
  SPACING_OPTIONS,
  FORMAT_BUTTONS,
  MESSAGES,
} from "./constants";
import {
  useElementState,
  useImageHandler,
  useTextFormatter,
  usePreviewHTML,
} from "./hooks";
import {
  isListType,
  sanitizeUrl,
  hasElementContent,
  isElementValid,
} from "./utils";
import CustomDialog from "../Custom/Dialog/CustomDialog";

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
  if (isListType(type)) {
    return type === "ul"
      ? "أدخل عناصر القائمة، كل عنصر في سطر منفصل:\n* العنصر الأول\n* العنصر الثاني\n* العنصر الثالث"
      : "أدخل عناصر القائمة، كل عنصر في سطر منفصل:\n1. العنصر الأول\n2. العنصر الثاني\n3. العنصر الثالث";
  }
  return "نص العنصر";
};

const ElementType = memo(
  ({ onChange, type }: { onChange: (type: string) => void; type: string }) => {
    return (
      <Select value={type} onValueChange={onChange} dir="rtl">
        <SelectTrigger>
          <SelectValue placeholder="نوع العنصر" />
        </SelectTrigger>
        <SelectContent>
          {ELEMENT_TYPES.map((elementType) => (
            <SelectItem key={elementType} value={elementType}>
              {getElementTypeLabel(elementType)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
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
  ),
);

FormatButtons.displayName = "FormatButtons";

const TextContentField = memo(
  ({
    type,
    dir,
    value,
    textAreaRef,
    inputRef,
    onChange,
  }: {
    type: string;
    dir: "rtl" | "ltr";
    value: string;
    textAreaRef: React.RefObject<HTMLTextAreaElement>;
    inputRef: React.RefObject<HTMLInputElement>;
    onChange: (value: string) => void;
  }) => {
    if (type === "p" || isListType(type)) {
      return (
        <Textarea
          ref={textAreaRef}
          rows={isListType(type) ? 6 : 4}
          dir={dir}
          className="w-full border rounded p-2 text-sm"
          placeholder={getPlaceholderText(type)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    }

    return (
      <Input
        ref={inputRef}
        dir={dir}
        placeholder="نص العنصر"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  },
);

TextContentField.displayName = "TextContentField";

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
  const { state, updateState, updateText, changeType, resetState } =
    useElementState(mode, html);
  const { handleImageUpload } = useImageHandler(updateState);
  const { formatSelection } = useTextFormatter(
    state,
    updateState,
    textAreaRef,
    inputRef,
  );

  const previewHtml = usePreviewHTML(state);
  const isValid = isElementValid(state);
  const hasPreview = hasElementContent(state);
  const isInvalidUrl =
    state.type === "a" && state.href !== "" && !sanitizeUrl(state.href);

  const handleSubmit = useCallback(() => {
    if (!isValid) return;

    if (mode === "create" && setResult) {
      setResult((prev) => [...prev, previewHtml]);
      resetState();
      setOpen(false);
      toast({ title: MESSAGES.elementAdded });
    } else if (mode === "edit" && onUpdate && index !== undefined) {
      onUpdate(index, previewHtml);
      toast({ title: MESSAGES.elementUpdated });
    }
  }, [isValid, mode, setResult, onUpdate, index, previewHtml, resetState]);

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
      e.target.value = "";

      if (file) {
        await handleImageUpload(file);
      }
    },
    [handleImageUpload],
  );

  const dialogContent = (
    <div className="flex flex-col gap-4">
      <ElementType type={state.type} onChange={changeType} />

      <div className="border rounded p-3 bg-gray-50">
        <h4 className="text-sm font-medium mb-2">معاينة:</h4>
        {hasPreview ? (
          <div
            className="min-h-[40px] bg-white p-2 rounded border"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
            dir={dir}
          />
        ) : (
          <div className="min-h-[40px] bg-white p-2 rounded border text-sm text-muted-foreground">
            {MESSAGES.noPreview}
          </div>
        )}
      </div>

      {state.type !== "img" && (
        <>
          <TextContentField
            type={state.type}
            dir={dir}
            value={state.displayText}
            textAreaRef={textAreaRef}
            inputRef={inputRef}
            onChange={updateText}
          />

          {!isListType(state.type) && (
            <FormatButtons formatSelection={formatSelection} />
          )}
        </>
      )}

      {state.type === "img" && (
        <div className="space-y-2">
          <label
            htmlFor="element-image"
            className="text-sm text-muted-foreground"
          >
            اختر صورة من جهازك
          </label>
          <Input
            id="element-image"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={state.loading}
          />
          {state.loading && (
            <p className="text-sm text-blue-500">جاري الرفع...</p>
          )}
          <Input
            placeholder="النص البديل (alt)"
            value={state.displayText}
            onChange={(e) => updateText(e.target.value)}
          />
        </div>
      )}

      {state.type === "a" && (
        <>
          <Input
            dir="ltr"
            placeholder="رابط (href)"
            value={state.href}
            onChange={(e) => updateState({ href: e.target.value })}
          />
          {isInvalidUrl && (
            <p className="text-sm text-red-600">{MESSAGES.invalidUrl}</p>
          )}
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
            <Button
              onClick={handleSubmit}
              className="text-white"
              disabled={!isValid || state.loading}
            >
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
        <Button variant="outline">
          <Plus /> إضافة عنصر
        </Button>
      }
      footer={
        <>
          <Button onClick={handleCancel} variant="outline">
            إلغاء
          </Button>
          <Button
            onClick={handleSubmit}
            className="text-white"
            disabled={!isValid || state.loading}
          >
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
