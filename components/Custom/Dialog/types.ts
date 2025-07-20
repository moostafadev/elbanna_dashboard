import { Dispatch, ReactNode, SetStateAction } from "react";

export interface IDialogProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  trigger?: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
}
