import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IDialogProps } from "./types";
import { memo } from "react";

const CustomDialog = memo(
  ({
    children,
    onOpenChange,
    open,
    trigger,
    description,
    footer,
    title,
  }: IDialogProps) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger ? (
          <DialogTrigger asChild dir="rtl">
            {trigger}
          </DialogTrigger>
        ) : null}
        <DialogContent className="sm:max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>{title ?? ""}</DialogTitle>
            <DialogDescription>{description ?? ""}</DialogDescription>
          </DialogHeader>
          {children}
          {footer ? (
            <DialogFooter className="gap-4">{footer}</DialogFooter>
          ) : null}
        </DialogContent>
      </Dialog>
    );
  }
);

CustomDialog.displayName = "CustomDialog";

export default CustomDialog;
