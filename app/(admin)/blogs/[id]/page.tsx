import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Heart, MessageSquare, PenLine } from "lucide-react";
import { getBlogById } from "@/actions/blog.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlogContent from "@/components/Blogs/BlogContent";
import BlogImage from "@/components/Blogs/BlogImage";
import BlogStatusBadge from "@/components/Blogs/BlogStatusBadge";
import { LANG_LABELS, getLangDir } from "@/components/Blogs/constants";

export const dynamic = "force-dynamic";

const formatDate = (date: Date) =>
  date.toLocaleString("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Cairo",
  });

const Page = async ({ params }: { params: { id: string } }) => {
  const res = await getBlogById(params.id);

  if (!res.success) {
    if (res.error === "Blog not found") notFound();
    throw new Error(res.error);
  }

  const blog = res.data;
  const dir = getLangDir(blog.lang);

  const testData = [
    { label: "المعرّف (id)", value: blog.id },
    { label: "اللغة", value: LANG_LABELS[blog.lang] },
    { label: "الفئة", value: blog.category },
    {
      label: "عدد عناصر المحتوى",
      value: String(blog.htmlContent.content.length),
    },
    { label: "تاريخ الإنشاء", value: formatDate(blog.createdAt) },
    { label: "آخر تعديل", value: formatDate(blog.updatedAt) },
  ];

  return (
    <div className="space-y-6">
      {/* Actions */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4 shadow-sm">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href="/blogs">
            <ArrowRight size={14} />
            العودة للمدونات
          </Link>
        </Button>
        <Button asChild size="sm" className="gap-2 text-white">
          <Link href={`/blogs/edit/${blog.id}`}>
            <PenLine size={14} />
            تعديل
          </Link>
        </Button>
      </section>

      {/* Article */}
      <article
        dir={dir}
        className="space-y-4 rounded-xl border bg-white p-4 shadow-sm md:p-8"
      >
        <BlogImage
          src={blog.image}
          alt={blog.title}
          variant="cover"
          priority
          className="rounded-lg"
        />

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="blue">{blog.category}</Badge>
          <BlogStatusBadge status={blog.status} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 md:text-4xl">
          {blog.title}
        </h1>
        <p className="text-gray-600">{blog.desc}</p>

        {blog.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {blog.keywords.map((keyword) => (
              <Badge key={keyword} variant="outline">
                {keyword}
              </Badge>
            ))}
          </div>
        )}

        <hr />
        <BlogContent content={blog.htmlContent.content} dir={dir} />
      </article>

      {/* Test panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-xl">
            بيانات الاختبار
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {testData.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border bg-gray-50 p-3"
              >
                <dt className="text-xs text-gray-500">{item.label}</dt>
                <dd className="mt-1 break-all text-sm font-medium text-gray-900">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <MessageSquare size={16} />
              {blog._count.comments} تعليق
            </span>
            <span className="flex items-center gap-1">
              <Heart size={16} />
              {blog._count.likes} إعجاب
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">التعليقات</h3>
            {blog.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                لا توجد تعليقات بعد
              </p>
            ) : (
              blog.comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border p-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                    <span className="font-semibold text-gray-800">
                      {comment.name}
                    </span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                  <div className="mt-2 flex gap-3 text-xs text-gray-500">
                    <span>الإعجابات: {comment.likes}</span>
                    <span>
                      الردود:{" "}
                      {Array.isArray(comment.replies)
                        ? comment.replies.length
                        : 0}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
