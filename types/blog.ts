import type { LANG, Status } from "@prisma/client";

export type CreateBlogInput = {
  title: string;
  desc: string;
  category: string;
  keywords: string[];
  image: string;
  status?: Status;
  lang: LANG | "";
  content: string[];
};

export type UpdateBlogInput = Partial<Omit<CreateBlogInput, "lang">> & {
  lang?: LANG;
};

export type GetBlogsFilters = {
  lang?: LANG;
  category?: string;
  status?: Status;
  page?: number;
  limit?: number;
};
