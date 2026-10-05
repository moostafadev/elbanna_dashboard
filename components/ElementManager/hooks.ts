import { useState, useCallback, useMemo } from "react";
import { ElementState } from "./types";
import { DEFAULT_VALUES, MESSAGES } from "./constants";
import {
  parseHTML,
  generatePreviewHTML,
  uploadImage,
  validateImageFile,
  wrapSelection,
  syncFormattedText,
  isListType,
} from "./utils";
import { toast } from "@/hooks/use-toast";

const createInitialState = (
  mode: "create" | "edit",
  html?: string,
): ElementState => ({
  ...(mode === "edit" && html ? parseHTML(html) : DEFAULT_VALUES),
  loading: false,
});

export const useElementState = (mode: "create" | "edit", html?: string) => {
  const [state, setState] = useState<ElementState>(() =>
    createInitialState(mode, html),
  );

  const updateState = useCallback((updates: Partial<ElementState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateText = useCallback((value: string) => {
    setState((prev) =>
      prev.displayText === value
        ? prev
        : {
            ...prev,
            displayText: value,
            formattedText: syncFormattedText(
              prev.formattedText,
              prev.displayText,
              value,
            ),
          },
    );
  }, []);

  const changeType = useCallback((type: string) => {
    setState((prev) => {
      const isMultiline = type === "p" || isListType(type);
      const displayText = isMultiline
        ? prev.displayText
        : prev.displayText.replace(/\s*\n+\s*/g, " ");

      return {
        ...prev,
        type,
        displayText,
        formattedText:
          displayText === prev.displayText
            ? prev.formattedText
            : syncFormattedText(
                prev.formattedText,
                prev.displayText,
                displayText,
              ),
      };
    });
  }, []);

  const resetState = useCallback(() => {
    setState(createInitialState("create"));
  }, []);

  return { state, updateState, updateText, changeType, resetState };
};

export const useImageHandler = (
  updateState: (updates: Partial<ElementState>) => void,
) => {
  const handleImageUpload = useCallback(
    async (file: File) => {
      const validationError = validateImageFile(file);

      if (validationError) {
        toast({ variant: "destructive", title: validationError });
        return;
      }

      try {
        updateState({ loading: true });
        const url = await uploadImage(file);
        updateState({ href: url });
        toast({ title: MESSAGES.imageUploaded });
      } catch (error) {
        console.error("Upload error:", error);
        toast({ variant: "destructive", title: MESSAGES.uploadFailed });
      } finally {
        updateState({ loading: false });
      }
    },
    [updateState],
  );

  return { handleImageUpload };
};

export const useTextFormatter = (
  state: ElementState,
  updateState: (updates: Partial<ElementState>) => void,
  textAreaRef: React.RefObject<HTMLTextAreaElement>,
  inputRef: React.RefObject<HTMLInputElement>,
) => {
  const { type, displayText, formattedText } = state;

  const formatSelection = useCallback(
    (className: string) => {
      if (isListType(type)) return;

      const el = type === "p" ? textAreaRef.current : inputRef.current;
      if (!el) return;

      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;

      if (start === end) return;

      updateState({
        formattedText: wrapSelection(
          formattedText,
          displayText,
          start,
          end,
          className,
        ),
      });

      el.focus();
      el.setSelectionRange(start, end);
    },
    [type, displayText, formattedText, updateState, textAreaRef, inputRef],
  );

  return { formatSelection };
};

export const usePreviewHTML = (state: ElementState) => {
  const { type, color, space, displayText, formattedText, href, openNewTab } =
    state;

  return useMemo(
    () =>
      generatePreviewHTML({
        type,
        color,
        space,
        displayText,
        formattedText,
        href,
        openNewTab,
      }),
    [type, color, space, displayText, formattedText, href, openNewTab],
  );
};
