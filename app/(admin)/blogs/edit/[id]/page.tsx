import React from "react";
import { notFound } from "next/navigation";
import { getBlogForEdit } from "@/actions/blog.actions";
import BlogForm from "@/components/Blogs/BlogForm/BlogForm";
import { keywordsToText } from "@/components/Blogs/BlogForm/utils";

export const dynamic = "force-dynamic";

const Page = async ({ params }: { params: { id: string } }) => {
  const res = await getBlogForEdit(params.id);

  if (!res.success) {
    if (res.error === "Blog not found") notFound();
    throw new Error(res.error);
  }

  const { title, desc, category, keywords, image, status, lang, htmlContent } =
    res.data;

  return (
    <section>
      <BlogForm
        mode="edit"
        blogId={params.id}
        initialValues={{
          title,
          desc,
          category,
          keywords: keywordsToText(keywords),
          image,
          status,
          lang,
          content: htmlContent.content,
        }}
      />
    </section>
  );
};

export default Page;
