"use client";

import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUp, ArrowDown, RefreshCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ElementManager } from "./ElementManager";

const UiCreator = () => {
  const [lang, setLang] = useState<"ar" | "en" | "fr" | "">("");
  const [dir, setDir] = useState<"rtl" | "ltr">("rtl");
  const [result, setResult] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleLangChange = (value: "ar" | "en" | "fr") => {
    setLang(value);
    setDir(value === "ar" ? "rtl" : "ltr");
  };

  const handleReset = () => {
    setLang("");
    setDir("rtl");
    setResult([]);
    setEditingIndex(null);
    setHoveredIndex(null);
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

  if (!lang) {
    return (
      <div className="p-4 space-y-4" dir="rtl">
        <h2 className="text-xl font-semibold">اختر اللغة</h2>
        <Select onValueChange={handleLangChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="اختر اللغة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="en">الإنجليزية</SelectItem>
            <SelectItem value="fr">الفرنسية</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div dir={dir} className="p-4">
      <div className="flex items-center justify-between mb-4">
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
      <ElementManager mode="create" setResult={setResult} />

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
          html={result[editingIndex]}
          index={editingIndex}
          onUpdate={handleUpdateElement}
          onCancel={() => setEditingIndex(null)}
        />
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              هل أنت متأكد من حذف هذا العنصر؟ هذا الإجراء لا يمكن التراجع عنه.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UiCreator;
