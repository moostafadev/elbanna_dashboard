"use client";

import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { ElementState, useImageHandler } from "@/components/ElementManager";

interface InputImageProps {
  updateState: (updates: Partial<ElementState>) => void;
  loading: boolean;
}

const InputImage: React.FC<InputImageProps> = ({ updateState, loading }) => {
  const { handleImageUpload } = useImageHandler(updateState);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";

      if (file) {
        await handleImageUpload(file);
      }
    },
    [handleImageUpload],
  );

  return (
    <Input
      type="file"
      accept="image/*"
      onChange={handleFileUpload}
      disabled={loading}
    />
  );
};

export default InputImage;
