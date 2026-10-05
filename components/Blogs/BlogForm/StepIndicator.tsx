import React, { memo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEPS } from "./constants";
import type { StepIndex } from "./types";

interface StepIndicatorProps {
  step: StepIndex;
  onSelect: (target: StepIndex) => void;
}

const StepIndicator = ({ step, onSelect }: StepIndicatorProps) => (
  <ol className="mt-6 flex items-center gap-2">
    {STEPS.map((item, i) => {
      const done = i < step;
      const active = i === step;

      return (
        <li
          key={item.title}
          className="flex flex-1 items-center gap-2 last:flex-none"
        >
          <button
            type="button"
            disabled={!done}
            aria-current={active ? "step" : undefined}
            onClick={() => onSelect(i as StepIndex)}
            className={cn(
              "flex items-center gap-2 text-sm font-semibold",
              done && "text-primary",
              active && "text-primary",
              !done && !active && "text-gray-400",
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm",
                done && "border-primary bg-primary text-white",
                active && "border-primary",
                !done && !active && "border-gray-300",
              )}
            >
              {done ? <Check size={16} /> : i + 1}
            </span>
            <span className="hidden sm:inline">{item.title}</span>
          </button>
          {i < STEPS.length - 1 && (
            <span
              className={cn("h-px flex-1", done ? "bg-primary" : "bg-gray-200")}
            />
          )}
        </li>
      );
    })}
  </ol>
);

export default memo(StepIndicator);
