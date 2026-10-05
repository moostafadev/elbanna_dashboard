export interface ElementManagerProps {
  setResult?: React.Dispatch<React.SetStateAction<string[]>>;
  html?: string;
  index?: number;
  onUpdate?: (index: number, newHtml: string) => void;
  onCancel?: () => void;
  mode: "create" | "edit";
  dir: "rtl" | "ltr";
}

export interface ElementState {
  type: string;
  color: string;
  space: string;
  displayText: string;
  formattedText: string;
  href: string;
  openNewTab: boolean;
  loading: boolean;
}

export type ParsedElement = Omit<ElementState, "loading">;
