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
  Trash2,
  Eye,
  Plus,
  FileText,
  Globe,
  Archive,
} from "lucide-react";
import Image from "next/image";

const LANG_LABEL: Record<string, string> = {
  ar: "العربية",
  en: "الإنجليزية",
  fr: "الفرنسية",
};

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
          <Link href="/blogs/create">
            <Button className="flex items-center gap-2 text-white">
              <Plus size={16} />
              إنشاء مدونة جديدة
            </Button>
          </Link>
        </div>
      </section>

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
        ].map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
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
              <Link href="/blogs/create">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus size={14} />
                  أنشئ أول مدونة
                </Button>
              </Link>
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
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {blog.image ? (
                            <Image
                              src={blog.image}
                              alt={blog.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="h-5 w-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Title + desc */}
                      <TableCell className="max-w-[200px]">
                        <p className="font-medium text-gray-900 truncate text-sm">
                          {blog.title}
                        </p>
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
                          {LANG_LABEL[blog.lang] ?? blog.lang}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={
                            blog.status === "show" ? "green" : "secondary"
                          }
                          className="text-xs"
                        >
                          {blog.status === "show" ? "مرئي" : "مؤرشف"}
                        </Badge>
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
                          <Link href={`/dashboard/blogs/edit/${blog.id}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                              title="تعديل"
                            >
                              <PenLine size={14} />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            title="حذف"
                          >
                            <Trash2 size={14} />
                          </Button>
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
