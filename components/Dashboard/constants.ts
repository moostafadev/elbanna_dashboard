import type { DashboardStats } from "@/types/dashboard";

export const EMPTY_STATS: DashboardStats = {
  totalBlogs: 0,
  visibleBlogs: 0,
  archivedBlogs: 0,
  totalViews: 0,
  totalComments: 0,
  totalLikes: 0,
  monthComments: 0,
  weeklyBlogs: [],
  weeklyComments: [],
  latestBlogs: [],
};
