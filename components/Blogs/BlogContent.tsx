import React from "react";

const BlogContent = ({
  content,
  dir,
}: {
  content: string[];
  dir: "rtl" | "ltr";
}) => (
  <div dir={dir}>
    {content.map((html, i) => (
      <div key={i} dangerouslySetInnerHTML={{ __html: html }} />
    ))}
  </div>
);

export default BlogContent;
