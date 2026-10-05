import type { Status } from "@prisma/client";

export interface WeeklyPoint {
  name: string;
  value: number;
}

export interface DashboardBlog {
  id: string;
  title: string;
  desc: string;
  category: string;
  image: string;
  status: Status;
  createdAt: Date;
  commentsCount: number;
  likesCount: number;
}

export interface DashboardStats {
  totalBlogs: number;
  visibleBlogs: number;
  archivedBlogs: number;
  totalViews: number;
  totalComments: number;
  totalLikes: number;
  monthComments: number;
  weeklyBlogs: WeeklyPoint[];
  weeklyComments: WeeklyPoint[];
  latestBlogs: DashboardBlog[];
}
