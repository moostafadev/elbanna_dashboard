"use client";

import React, { memo, type Dispatch, type SetStateAction } from "react";
import ContentBuilder from "../ContentBuilder";

interface ContentStepProps {
  content: string[];
  dir: "rtl" | "ltr";
  setContent: Dispatch<SetStateAction<string[]>>;
}

const ContentStep = ({ content, dir, setContent }: ContentStepProps) => (
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">
      أضف عناصر المقال بالترتيب (عناوين، فقرات، صور، روابط، قوائم). عدد العناصر
      الحالي: {content.length}
    </p>
    <ContentBuilder result={content} setResult={setContent} dir={dir} />
  </div>
);

export default memo(ContentStep);
