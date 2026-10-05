import React from "react";
import Link from "next/link";
import {
  AlertCircle,
  Calendar,
  Eye,
  FileText,
  Heart,
  MessageSquare,
  Plus,
} from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatCard from "@/components/Dashboard/StatCard";
import WeeklyBarChart from "@/components/Dashboard/WeeklyBarChart";
import { EMPTY_STATS } from "@/components/Dashboard/constants";
import BlogImage from "@/components/Blogs/BlogImage";
import BlogStatusBadge from "@/components/Blogs/BlogStatusBadge";

export const dynamic = "force-dynamic";

const Page = async () => {
  const res = await getDashboardStats();
  const stats = res.success ? res.data : EMPTY_STATS;

  const counters = [
    {
      title: "إجمالي المقالات",
      value: stats.totalBlogs,
      hint: `مرئي: ${stats.visibleBlogs} · مؤرشف: ${stats.archivedBlogs}`,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "إجمالي المشاهدات",
      value: stats.totalViews,
      hint: "مجموع مشاهدات كل الصفحات",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "إجمالي التعليقات",
      value: stats.totalComments,
      hint: `آخر 4 أسابيع: ${stats.monthComments}`,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "إجمالي الإعجابات",
      value: stats.totalLikes,
      hint: "على جميع المقالات",
      icon: Heart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <>
      {/* Header */}
      <section className="rounded-xl border bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h1 className="mb-2 text-xl font-bold text-gray-900 md:text-3xl">
              لوحة التحكم
            </h1>
            <p className="text-sm text-gray-600 md:text-base">
              مكتب البنا للمحاماة - إدارة المحتوى
            </p>
          </div>
          <div className="flex items-center self-end">
            <Badge className="px-3 py-1 text-xs md:text-sm" variant={"blue"}>
              آخر تحديث:{" "}
              {new Date().toLocaleString("ar-EG", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "Africa/Cairo",
              })}
            </Badge>
          </div>
        </div>
      </section>

      {/* Error State */}
      {!res.success && (
        <section className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">
            تعذر تحميل بيانات لوحة التحكم، حاول تحديث الصفحة.
          </p>
        </section>
      )}

      {/* Counters */}
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {counters.map((counter) => (
          <StatCard key={counter.title} {...counter} />
        ))}
      </section>

      {/* Analytics */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-2xl">
              <FileText className="ml-2 h-5 w-5 text-blue-600" />
              المقالات المنشورة
            </CardTitle>
            <CardDescription>
              عدد المقالات المضافة أسبوعيًا - آخر 4 أسابيع
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyBarChart
              data={stats.weeklyBlogs}
              label="المقالات"
              color="#3B82F6"
            />
          </CardContent>
        </Card>

        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-2xl">
              <MessageSquare className="ml-2 h-5 w-5 text-green-600" />
              التعليقات
            </CardTitle>
            <CardDescription>
              عدد التعليقات الجديدة أسبوعيًا - آخر 4 أسابيع
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyBarChart
              data={stats.weeklyComments}
              label="التعليقات"
              color="#10B981"
            />
          </CardContent>
        </Card>
      </section>

      {/* Latest Blogs */}
      <section>
        <Card className="transition-shadow duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex flex-col gap-2 text-base md:flex-row md:items-center md:justify-between md:text-2xl">
              <div className="flex items-center">
                <FileText className="ml-2 h-5 w-5 text-primary" />
                أحدث المقالات
              </div>
              <Badge variant={"secondary"} className="self-end">
                {stats.latestBlogs.length} مقالات
              </Badge>
            </CardTitle>
            <CardDescription>آخر المقالات المضافة</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.latestBlogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
                <FileText className="h-12 w-12 opacity-30" />
                <p className="text-sm">لا توجد مقالات بعد</p>
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link href="/blogs/create">
                    <Plus size={14} />
                    أنشئ أول مدونة
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stats.latestBlogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blogs/${blog.id}`}
                    className="overflow-hidden rounded-lg border bg-white transition-shadow duration-300 hover:shadow-md"
                  >
                    <div className="relative">
                      <BlogImage
                        src={blog.image}
                        alt={blog.title}
                        variant="card"
                      />
                      <div className="absolute right-3 top-3">
                        <BlogStatusBadge status={blog.status} />
                      </div>
                    </div>
                    <div className="p-3 md:p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge className="text-xs" variant={"blue"}>
                          {blog.category}
                        </Badge>
                      </div>
                      <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900">
                        {blog.title}
                      </h3>
                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                        {blog.desc}
                      </p>
                      <div className="flex items-center justify-between border-t pt-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="ml-1 h-3 w-3" />
                          {blog.createdAt.toLocaleDateString("ar-EG")}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {blog.commentsCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {blog.likesCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default Page;
