"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUp, ArrowDown, RefreshCcw } from "lucide-react";
import { ElementManager } from "./ElementManager";
import CustomDialog from "./Custom/Dialog/CustomDialog";
import InputImage from "./Custom/Inputs/InputImage";
import { Input } from "./ui/input";
import CustomSelect from "./Custom/Select/CustomSelect";
import { createBlog } from "@/actions/blog.actions";
import { LANG } from "@prisma/client";

const UiCreator = () => {
  const [lang, setLang] = useState<LANG | "">("");
  const [dir, setDir] = useState<"rtl" | "ltr">("rtl");
  const [result, setResult] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<"show" | "archive">("show");

  const handleLangChange = (value: LANG) => {
    setLang(value);
    setDir(value === "ar" ? "rtl" : "ltr");
  };

  const handleReset = () => {
    setLang("");
    setDir("rtl");
    setResult([]);
    setEditingIndex(null);
    setHoveredIndex(null);
    setTitle("");
    setDesc("");
    setCategory("");
    setKeywords("");
    setImage("");
    setStatus("show");
  };

  const handleDelete = (index: number) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      setResult((prev) => prev.filter((_, i) => i !== deleteIndex));
      setHoveredIndex(null);
      setDeleteDialogOpen(false);
      setDeleteIndex(null);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleUpdateElement = (index: number, newHtml: string) => {
    setResult((prev) => prev.map((item, i) => (i === index ? newHtml : item)));
    setEditingIndex(null);
  };

  const moveElement = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= result.length) return;

    const newResult = [...result];
    [newResult[index], newResult[newIndex]] = [
      newResult[newIndex],
      newResult[index],
    ];
    setResult(newResult);
  };

  const handleSubmit = async () => {
    const res = await createBlog({
      title,
      desc,
      category,
      keywords: keywords.split(",").map((k) => k.trim()),
      image,
      status,
      content: result,
      lang,
    });

    console.log(res);

    if (res.success) {
      alert("تم حفظ التدوينة بنجاح!");
      handleReset();
    } else {
      console.log(res.error ?? "حدث خطأ أثناء الحفظ.");
    }
  };

  if (!lang) {
    return (
      <div className="space-y-4" dir="rtl">
        <h2 className="text-xl font-semibold">اختر لغة المدونة</h2>
        <CustomSelect
          onValueChange={(value) => handleLangChange(value as LANG)}
          items={[
            { value: "ar", label: "العربية" },
            { value: "en", label: "الإنجليزية" },
            { value: "fr", label: "الفرنسية" },
          ]}
          className="w-40"
          placeholder="اختر اللغة"
        />
      </div>
    );
  }

  return (
    <div dir={dir} className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          اللغة:{" "}
          {lang === "ar"
            ? "العربية"
            : lang === "en"
              ? "الإنجليزية"
              : "الفرنسية"}
        </div>
        <Button variant="destructive" size="sm" onClick={handleReset}>
          <RefreshCcw size={16} />
          إعادة تعيين
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">العنوان</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="أدخل عنوان التدوينة"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">الوصف</label>
          <Input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="وصف موجز للتدوينة"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">الفئة</label>
          <Input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="مثلاً: قانون الأسرة"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">الكلمات المفتاحية</label>
          <Input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="مثال: طلاق، نفقة، حضانة"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">الصورة</label>
          <InputImage
            updateState={(data) => {
              if (data.href) setImage(data.href);
              if (typeof data.loading === "boolean") setUploading(data.loading);
            }}
            loading={uploading}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">الحالة</label>
          <CustomSelect
            onValueChange={(val) => setStatus(val as "show" | "archive")}
            items={[
              { value: "show", label: "مرئي" },
              { value: "archive", label: "مؤرشف" },
            ]}
            className="w-full"
            placeholder="اختر الحالة"
          />
        </div>
      </div>

      <ElementManager mode="create" dir={dir} setResult={setResult} />

      {result.map((html, i) => (
        <div
          key={i}
          className="relative group rounded hover:bg-gray-50 transition-colors p-1 -m-1"
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div dangerouslySetInnerHTML={{ __html: html }} />

          {hoveredIndex === i && (
            <div className="absolute top-0 right-0 flex gap-1 bg-white shadow-lg rounded border p-1 z-10 opacity-90 hover:opacity-100 transition-opacity">
              {i > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveElement(i, "up")}
                  className="p-1 h-7 w-7 hover:bg-gray-50"
                  title="نقل للأعلى"
                >
                  <ArrowUp size={14} />
                </Button>
              )}
              {i < result.length - 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => moveElement(i, "down")}
                  className="p-1 h-7 w-7 hover:bg-gray-50"
                  title="نقل للأسفل"
                >
                  <ArrowDown size={14} />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEdit(i)}
                className="p-1 h-7 w-7 hover:bg-blue-50 hover:text-blue-600"
                title="تعديل"
              >
                <Pencil size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(i)}
                className="p-1 h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-700"
                title="حذف"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          )}
        </div>
      ))}

      {editingIndex !== null && (
        <ElementManager
          mode="edit"
          dir={dir}
          html={result[editingIndex]}
          index={editingIndex}
          onUpdate={handleUpdateElement}
          onCancel={() => setEditingIndex(null)}
        />
      )}

      <Button onClick={handleSubmit} className="mt-6 text-white">
        حفظ المدونة
      </Button>

      <CustomDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="تأكيد الحذف"
        footer={
          <>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outline"
            >
              إلغاء
            </Button>
            <Button
              onClick={confirmDelete}
              className="text-white"
              variant="destructive"
            >
              حذف
            </Button>
          </>
        }
      >
        <div className="py-4">
          <p>
            هل أنت متأكد من حذف هذا العنصر؟ هذا الإجراء لا يمكن التراجع عنه.
          </p>
        </div>
      </CustomDialog>
    </div>
  );
};

export default UiCreator;
