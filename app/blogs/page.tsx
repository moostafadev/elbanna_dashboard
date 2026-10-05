import React from "react";
import Link from "next/link";
import { getBlogs } from "@/actions/blog.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PenLine,
  Eye,
  Plus,
  FileText,
  Globe,
  Archive,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import DeleteBlogButton from "@/components/Blogs/DeleteBlogButton";
import BlogStatusBadge from "@/components/Blogs/BlogStatusBadge";
import BlogImage from "@/components/Blogs/BlogImage";
import { LANG_LABELS } from "@/components/Blogs/constants";

export const dynamic = "force-dynamic";

const Page = async () => {
  const res = await getBlogs({ limit: 50 });
  const blogs = res.success ? res.data.blogs : [];
  const total = res.success ? res.data.pagination.total : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
        <div className="flex items-center justify-between flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">
              إدارة المدونات
            </h1>
            <p className="text-gray-500 text-sm">
              عرض وإدارة جميع مقالات المدونة
            </p>
          </div>
          <Button asChild className="flex items-center gap-2 text-white">
            <Link href="/blogs/create">
              <Plus size={16} />
              إنشاء مدونة جديدة
            </Link>
          </Button>
        </div>
      </section>

      {/* Error State */}
      {!res.success && (
        <section className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">
            حدث خطأ أثناء تحميل المدونات، حاول تحديث الصفحة.
          </p>
        </section>
      )}

      {/* Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "إجمالي المقالات",
            value: total,
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "مرئي",
            value: blogs.filter((b) => b.status === "show").length,
            icon: Eye,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "مؤرشف",
            value: blogs.filter((b) => b.status === "archive").length,
            icon: Archive,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          },
          {
            label: "اللغات",
            value: new Set(blogs.map((b) => b.lang)).size,
            icon: Globe,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base md:text-xl">
            <FileText className="h-5 w-5 text-primary" />
            قائمة المدونات
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <FileText className="h-12 w-12 opacity-30" />
              <p className="text-sm">لا توجد مدونات بعد</p>
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/blogs/create">
                  <Plus size={14} />
                  أنشئ أول مدونة
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="text-right font-semibold text-gray-700 w-12">
                      #
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">
                      الصورة
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">
                      العنوان
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 hidden md:table-cell">
                      الفئة
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 hidden lg:table-cell">
                      اللغة
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">
                      الحالة
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 hidden lg:table-cell">
                      التعليقات
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 hidden lg:table-cell">
                      التاريخ
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">
                      الإجراءات
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog, i) => (
                    <TableRow
                      key={blog.id}
                      className="hover:bg-primary/5 transition-colors"
                    >
                      <TableCell className="text-gray-400 text-sm">
                        {i + 1}
                      </TableCell>

                      {/* Image */}
                      <TableCell>
                        <BlogImage
                          src={blog.image}
                          alt={blog.title}
                          variant="thumb"
                          className="rounded-lg"
                        />
                      </TableCell>

                      {/* Title + desc */}
                      <TableCell className="max-w-[200px]">
                        <Link
                          href={`/blogs/${blog.id}`}
                          className="block font-medium text-gray-900 truncate text-sm hover:text-primary"
                        >
                          {blog.title}
                        </Link>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {blog.desc}
                        </p>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="text-xs">
                          {blog.category}
                        </Badge>
                      </TableCell>

                      {/* Lang */}
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm text-gray-600">
                          {LANG_LABELS[blog.lang]}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <BlogStatusBadge status={blog.status} />
                      </TableCell>

                      {/* Comments count */}
                      <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                        {blog._count.comments}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString("ar-EG")}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                          >
                            <Link
                              href={`/blogs/${blog.id}`}
                              title="عرض واختبار"
                              aria-label="عرض واختبار"
                            >
                              <ExternalLink size={14} />
                            </Link>
                          </Button>
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Link
                              href={`/blogs/edit/${blog.id}`}
                              title="تعديل"
                              aria-label="تعديل"
                            >
                              <PenLine size={14} />
                            </Link>
                          </Button>
                          <DeleteBlogButton id={blog.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
