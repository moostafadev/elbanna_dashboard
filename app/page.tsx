"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  FileText,
  HelpCircle,
  TrendingUp,
  Calendar,
  User,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";

type BlogStatus = "منشور" | "مسودة" | "مؤرشف";
type LatestBlog = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  views: number;
  category: string;
  image: string;
  status: BlogStatus;
};

const Page = () => {
  // Static data for counters
  const counters = [
    {
      title: "إجمالي المقالات",
      value: "156",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "الأسئلة الشائعة",
      value: "89",
      change: "+8%",
      icon: HelpCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "إجمالي المشاهدات",
      value: "24,567",
      change: "+23%",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "معدل النمو",
      value: "18.5%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // Analytics data for charts
  const blogAnalytics = [
    { name: "الأسبوع 1", المقالات: 12 },
    { name: "الأسبوع 2", المقالات: 19 },
    { name: "الأسبوع 3", المقالات: 8 },
    { name: "الأسبوع 4", المقالات: 15 },
  ];

  const faqAnalytics = [
    { name: "الأسبوع 1", الأسئلة: 8 },
    { name: "الأسبوع 2", الأسئلة: 12 },
    { name: "الأسبوع 3", الأسئلة: 6 },
    { name: "الأسبوع 4", الأسئلة: 10 },
  ];

  // Latest blogs data
  const latestBlogs: LatestBlog[] = [
    {
      id: 1,
      title: "قوانين العمل الجديدة في مصر 2024",
      excerpt:
        "شرح مفصل للتعديلات الأخيرة على قانون العمل المصري وتأثيرها على أصحاب العمل والموظفين",
      author: "أحمد البنا",
      date: "2024-01-15",
      views: 1250,
      category: "قانون العمل",
      image:
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop",
      status: "منشور",
    },
    {
      id: 2,
      title: "حقوق المستهلك في التجارة الإلكترونية",
      excerpt:
        "دليل شامل حول حقوق المستهلك عند التسوق الإلكتروني والحماية القانونية المتاحة",
      author: "سارة محمد",
      date: "2024-01-12",
      views: 980,
      category: "حماية المستهلك",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
      status: "منشور",
    },
    {
      id: 3,
      title: "إجراءات تأسيس الشركات في مصر",
      excerpt:
        "خطوات مفصلة لتأسيس الأنواع المختلفة من الشركات والمستندات المطلوبة",
      author: "محمد البنا",
      date: "2024-01-10",
      views: 1560,
      category: "قانون الشركات",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      status: "مسودة",
    },
  ];

  type StatusBadgeProps = {
    status: "منشور" | "مسودة" | "مؤرشف";
  };

  const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    return (
      <Badge className={`text-xs`} variant={"green"}>
        {status}
      </Badge>
    );
  };

  return (
    <>
      {/* Header */}
      <section className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
        <div className="flex items-center justify-between flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
              لوحة التحكم
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              مكتب البنا للمحاماة - إدارة المحتوى والأسئلة الشائعة
            </p>
          </div>
          <div className="flex items-center self-end">
            <Badge className="px-3 py-1 text-xs md:text-sm" variant={"blue"}>
              آخر تحديث: اليوم
            </Badge>
          </div>
        </div>
      </section>

      {/* First Section - Counters */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {counters.map((counter, index) => (
          <Card
            key={index}
            className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {counter.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {counter.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
                    <span className="text-sm text-green-600 font-medium">
                      {counter.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${counter.bgColor}`}>
                  <counter.icon className={`h-6 w-6 ${counter.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Second Section - Analytics */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-2xl">
              <FileText className="h-5 w-5 ml-2 text-blue-600" />
              تحليلات المقالات
            </CardTitle>
            <CardDescription>
              عدد المقالات المنشورة والمشاهدات - الشهر الماضي
            </CardDescription>
          </CardHeader>
          <CardContent dir="ltr">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={blogAnalytics}
                margin={{ top: 0, right: -10, bottom: 0, left: -30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="المقالات" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-2xl">
              <HelpCircle className="h-5 w-5 ml-2 text-green-600" />
              تحليلات الأسئلة الشائعة
            </CardTitle>
            <CardDescription>
              الأسئلة الجديدة والإجابات المضافة - الشهر الماضي
            </CardDescription>
          </CardHeader>
          <CardContent dir="ltr">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={faqAnalytics}
                margin={{ top: 0, right: -10, bottom: 0, left: -30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="الأسئلة" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* Third Section - Latest Blogs */}
      <section>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex md:items-center flex-col md:flex-row md:justify-between gap-2 text-base md:text-2xl">
              <div className="flex items-center">
                <FileText className="h-5 w-5 ml-2 text-primary" />
                أحدث المقالات
              </div>
              <Badge variant={"secondary"} className="self-end">
                {latestBlogs.length} مقالات
              </Badge>
            </CardTitle>
            <CardDescription>آخر المقالات المضافة والمحدثة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="relative">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={400}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={blog.status} />
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="text-xs" variant={"blue"}>
                        {blog.category}
                      </Badge>
                      <MoreHorizontal className="h-4 w-4 text-gray-400 cursor-pointer" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <User className="h-3 w-3 ml-1" />
                        {blog.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 ml-1" />
                        {blog.date}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-4 w-4 ml-1" />
                        {blog.views.toLocaleString()} مشاهدة
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default Page;
