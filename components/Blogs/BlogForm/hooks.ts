import {
  useCallback,
  useState,
  useTransition,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { createBlog, updateBlog } from "@/actions/blog.actions";
import { toast } from "@/hooks/use-toast";
import { getLangDir } from "../constants";
import { DEFAULT_FORM_VALUES, FORM_MESSAGES } from "./constants";
import type {
  BlogFormProps,
  BlogFormValues,
  FieldChange,
  StepIndex,
} from "./types";
import {
  getStepError,
  isContentValid,
  isDetailsValid,
  isStepValid,
  toBlogInput,
  translateError,
} from "./utils";

export const useBlogForm = ({ mode, blogId, initialValues }: BlogFormProps) => {
  const router = useRouter();
  const [values, setValues] = useState<BlogFormValues>(
    initialValues ?? DEFAULT_FORM_VALUES,
  );
  const [step, setStep] = useState<StepIndex>(0);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const setField = useCallback<FieldChange>((key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setContent = useCallback((action: SetStateAction<string[]>) => {
    setValues((prev) => ({
      ...prev,
      content: typeof action === "function" ? action(prev.content) : action,
    }));
  }, []);

  const goNext = useCallback(() => {
    if (!isStepValid(step, values)) {
      toast({ variant: "destructive", title: getStepError(step) });
      return;
    }
    setStep((prev) => (prev < 2 ? ((prev + 1) as StepIndex) : prev));
  }, [step, values]);

  const goBack = useCallback(() => {
    setStep((prev) => (prev > 0 ? ((prev - 1) as StepIndex) : prev));
  }, []);

  const goTo = useCallback((target: StepIndex) => {
    setStep((prev) => (target < prev ? target : prev));
  }, []);

  const handleSubmit = useCallback(() => {
    if (
      !isDetailsValid(values) ||
      !isContentValid(values) ||
      values.lang === ""
    ) {
      toast({ variant: "destructive", title: FORM_MESSAGES.fillRequired });
      return;
    }

    const input = toBlogInput(values, values.lang);

    startTransition(async () => {
      const res =
        mode === "edit" && blogId
          ? await updateBlog(blogId, input)
          : await createBlog(input);

      if (!res.success) {
        toast({ variant: "destructive", title: translateError(res.error) });
        return;
      }

      toast({
        title: mode === "edit" ? FORM_MESSAGES.updated : FORM_MESSAGES.created,
      });
      router.push("/blogs");
      router.refresh();
    });
  }, [values, mode, blogId, router]);

  return {
    values,
    step,
    uploading,
    isPending,
    dir: getLangDir(values.lang),
    setField,
    setContent,
    setUploading,
    goNext,
    goBack,
    goTo,
    handleSubmit,
  };
};
