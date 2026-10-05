"use client";

import React, { memo, useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { deleteBlog } from "@/actions/blog.actions";
import { AUTH_MESSAGES } from "@/components/Auth/constants";
import CustomDialog from "@/components/Custom/Dialog/CustomDialog";

const DeleteBlogButton = ({ id }: { id: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = useCallback(() => {
    startTransition(async () => {
      const res = await deleteBlog(id);

      if (!res.success) {
        toast({
          variant: "destructive",
          title:
            res.error === "Unauthorized"
              ? AUTH_MESSAGES.sessionExpired
              : "فشل حذف المدونة",
        });
        return;
      }

      setOpen(false);
      toast({ title: "تم حذف المدونة بنجاح" });
      router.refresh();
    });
  }, [id, router]);

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
        title="حذف"
        aria-label="حذف"
        onClick={() => setOpen(true)}
      >
        <Trash2 size={14} />
      </Button>

      <CustomDialog
        open={open}
        onOpenChange={setOpen}
        title="تأكيد الحذف"
        footer={
          <>
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              disabled={isPending}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleDelete}
              className="text-white"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? "جاري الحذف..." : "حذف"}
            </Button>
          </>
        }
      >
        <div className="py-4">
          <p>
            هل أنت متأكد من حذف هذه المدونة؟ سيتم حذف المحتوى والتعليقات
            والإعجابات المرتبطة بها، ولا يمكن التراجع عن هذا الإجراء.
          </p>
        </div>
      </CustomDialog>
    </>
  );
};

export default memo(DeleteBlogButton);
