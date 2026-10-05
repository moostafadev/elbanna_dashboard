"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types/action";
import type { DashboardStats, WeeklyPoint } from "@/types/dashboard";

const DAY_MS = 86_400_000;
const WEEK_MS = 7 * DAY_MS;
const WEEK_LABELS = [
  "قبل 3 أسابيع",
  "قبل أسبوعين",
  "الأسبوع الماضي",
  "هذا الأسبوع",
];

const bucketByWeek = (
  items: { createdAt: Date }[],
  now: number,
): WeeklyPoint[] => {
  const counts = [0, 0, 0, 0];

  for (const { createdAt } of items) {
    const weeksAgo = Math.floor((now - createdAt.getTime()) / WEEK_MS);
    if (weeksAgo >= 0 && weeksAgo < 4) counts[3 - weeksAgo]++;
  }

  return WEEK_LABELS.map((name, i) => ({ name, value: counts[i] }));
};

export async function getDashboardStats(): Promise<
  ActionResult<DashboardStats>
> {
  const now = Date.now();
  const since = new Date(now - 4 * WEEK_MS);

  try {
    const [
      totalBlogs,
      visibleBlogs,
      archivedBlogs,
      viewsAggregate,
      totalComments,
      totalLikes,
      recentBlogs,
      recentComments,
      latest,
    ] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { status: "show" } }),
      prisma.blog.count({ where: { status: "archive" } }),
      prisma.views.aggregate({ _sum: { count: true } }),
      prisma.comment.count(),
      prisma.like.count(),
      prisma.blog.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      prisma.comment.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      prisma.blog.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          desc: true,
          category: true,
          image: true,
          status: true,
          createdAt: true,
          _count: { select: { comments: true, likes: true } },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalBlogs,
        visibleBlogs,
        archivedBlogs,
        totalViews: viewsAggregate._sum.count ?? 0,
        totalComments,
        totalLikes,
        monthComments: recentComments.length,
        weeklyBlogs: bucketByWeek(recentBlogs, now),
        weeklyComments: bucketByWeek(recentComments, now),
        latestBlogs: latest.map(({ _count, ...blog }) => ({
          ...blog,
          commentsCount: _count.comments,
          likesCount: _count.likes,
        })),
      },
    };
  } catch (error) {
    console.error("[getDashboardStats]", error);
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}
