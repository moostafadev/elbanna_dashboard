import { useState, useEffect, useCallback, useMemo } from "react";
import { ElementState } from "./types";
import { DEFAULT_VALUES, LIST_ELEMENT_TYPES } from "./constants";
import {
  parseHTML,
  generatePreviewHTML,
  uploadImage,
  getFormattedPosition,
  applyFormatting,
  parseListText,
} from "./utils";

export const useElementState = (mode: "create" | "edit", html?: string) => {
  const [state, setState] = useState<ElementState>({
    ...DEFAULT_VALUES,
    loading: false,
    listItems: [],
  });

  useEffect(() => {
    if (mode === "edit" && html) {
      const parsed = parseHTML(html);
      setState((prev) => ({
        ...prev,
        type: parsed.type,
        color: parsed.color,
        space: parsed.space,
        displayText: parsed.displayText,
        formattedText: parsed.formattedText,
        href: parsed.href,
        openNewTab: parsed.openNewTab,
        listItems: parsed.listItems,
      }));
    }
  }, [mode, html]);

  useEffect(() => {
    if (mode === "create") {
      if (LIST_ELEMENT_TYPES.includes(state.type)) {
        const items = parseListText(state.displayText);
        setState((prev) => ({
          ...prev,
          listItems: items,
          formattedText: prev.displayText,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          formattedText: prev.displayText,
        }));
      }
    }
  }, [state.displayText, state.type, mode]);

  const updateState = useCallback((updates: Partial<ElementState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      ...DEFAULT_VALUES,
      loading: false,
      listItems: [],
    });
  }, []);

  return {
    state,
    updateState,
    resetState,
  };
};

export const useImageHandler = (
  updateState: (updates: Partial<ElementState>) => void
) => {
  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        updateState({ loading: true });
        const url = await uploadImage(file);
        updateState({ href: url, loading: false });
      } catch (error) {
        console.error("Upload error:", error);
        alert("حدث خطأ أثناء رفع الصورة");
        updateState({ loading: false });
      }
    },
    [updateState]
  );

  return { handleImageUpload };
};

export const useTextFormatter = (
  state: ElementState,
  updateState: (updates: Partial<ElementState>) => void,
  mode: "create" | "edit",
  textAreaRef: React.RefObject<HTMLTextAreaElement>,
  inputRef: React.RefObject<HTMLInputElement>
) => {
  const formatSelection = useCallback(
    (className: string) => {
      if (LIST_ELEMENT_TYPES.includes(state.type)) {
        return;
      }

      const el = state.type === "p" ? textAreaRef.current : inputRef.current;
      if (!el) return;

      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const selected = state.displayText.slice(start, end);

      if (!selected) return;

      const before = state.displayText.slice(0, start);
      const after = state.displayText.slice(end);
      const htmlWrapper = applyFormatting(className, selected);

      const newDisplayText = before + selected + after;

      let newFormattedText: string;
      if (mode === "create") {
        newFormattedText =
          state.formattedText.slice(0, start) +
          `<span class="${className}">${selected}</span>` +
          state.formattedText.slice(end);
      } else {
        const beforeFormatted = state.formattedText.substring(
          0,
          getFormattedPosition(start, state.formattedText, state.displayText)
        );
        const afterFormatted = state.formattedText.substring(
          getFormattedPosition(end, state.formattedText, state.displayText)
        );
        newFormattedText = beforeFormatted + htmlWrapper + afterFormatted;
      }

      updateState({
        displayText: newDisplayText,
        formattedText: newFormattedText,
      });

      setTimeout(() => {
        el.focus();
        el.selectionStart = el.selectionEnd = (before + selected).length;
      }, 0);
    },
    [state, updateState, mode, textAreaRef, inputRef]
  );

  return { formatSelection };
};

export const usePreviewHTML = (state: ElementState) => {
  return useMemo(() => {
    return generatePreviewHTML(
      state.type,
      state.color,
      state.space,
      state.displayText,
      state.formattedText,
      state.href,
      state.openNewTab,
      state.listItems
    );
  }, [state]);
};
