"use client";

import React, {
  useState,
  useCallback,
  memo,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ElementManager, MESSAGES } from "@/components/ElementManager";
import CustomDialog from "@/components/Custom/Dialog/CustomDialog";

interface ContentBuilderProps {
  result: string[];
  setResult: Dispatch<SetStateAction<string[]>>;
  dir: "rtl" | "ltr";
}

interface ResultItemProps {
  html: string;
  index: number;
  total: number;
  onMove: (index: number, direction: "up" | "down") => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const ResultItem = memo(
  ({ html, index, total, onMove, onEdit, onDelete }: ResultItemProps) => (
    <div className="relative group rounded hover:bg-gray-50 transition-colors p-1 -m-1">
      <div dangerouslySetInnerHTML={{ __html: html }} />

      <div className="absolute top-0 right-0 flex gap-1 bg-white shadow-lg rounded border p-1 z-10 opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto [@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto">
        {index > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onMove(index, "up")}
            className="p-1 h-7 w-7 hover:bg-gray-50"
            title="نقل للأعلى"
            aria-label="نقل للأعلى"
          >
            <ArrowUp size={14} />
          </Button>
        )}
        {index < total - 1 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onMove(index, "down")}
            className="p-1 h-7 w-7 hover:bg-gray-50"
            title="نقل للأسفل"
            aria-label="نقل للأسفل"
          >
            <ArrowDown size={14} />
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(index)}
          className="p-1 h-7 w-7 hover:bg-blue-50 hover:text-blue-600"
          title="تعديل"
          aria-label="تعديل"
        >
          <Pencil size={14} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(index)}
          className="p-1 h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-700"
          title="حذف"
          aria-label="حذف"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  ),
);

ResultItem.displayName = "ResultItem";

const ContentBuilder = ({ result, setResult, dir }: ContentBuilderProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const handleEdit = useCallback((index: number) => setEditingIndex(index), []);
  const handleDelete = useCallback(
    (index: number) => setDeleteIndex(index),
    [],
  );
  const handleCancelEdit = useCallback(() => setEditingIndex(null), []);
  const closeDeleteDialog = useCallback(() => setDeleteIndex(null), []);

  const confirmDelete = useCallback(() => {
    if (deleteIndex === null) return;

    setResult((prev) => prev.filter((_, i) => i !== deleteIndex));
    setDeleteIndex(null);
    toast({ title: MESSAGES.elementDeleted });
  }, [deleteIndex, setResult]);

  const handleUpdateElement = useCallback(
    (index: number, newHtml: string) => {
      setResult((prev) =>
        prev.map((item, i) => (i === index ? newHtml : item)),
      );
      setEditingIndex(null);
    },
    [setResult],
  );

  const moveElement = useCallback(
    (index: number, direction: "up" | "down") => {
      setResult((prev) => {
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= prev.length) return prev;

        const next = [...prev];
        [next[index], next[newIndex]] = [next[newIndex], next[index]];
        return next;
      });
    },
    [setResult],
  );

  return (
    <div dir={dir}>
      <ElementManager mode="create" dir={dir} setResult={setResult} />

      {result.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {MESSAGES.emptyResult}
        </p>
      ) : (
        result.map((html, i) => (
          <ResultItem
            key={i}
            html={html}
            index={i}
            total={result.length}
            onMove={moveElement}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      )}

      {editingIndex !== null && (
        <ElementManager
          key={editingIndex}
          mode="edit"
          dir={dir}
          html={result[editingIndex]}
          index={editingIndex}
          onUpdate={handleUpdateElement}
          onCancel={handleCancelEdit}
        />
      )}

      <CustomDialog
        open={deleteIndex !== null}
        onOpenChange={closeDeleteDialog}
        title="تأكيد الحذف"
        footer={
          <>
            <Button onClick={closeDeleteDialog} variant="outline">
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

export default memo(ContentBuilder);
