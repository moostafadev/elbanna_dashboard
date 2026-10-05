"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/action";
import type {
  CreateBlogInput,
  GetBlogsFilters,
  UpdateBlogInput,
} from "@/types/blog";

// ─── Types ────────────────────────────────────────────────────────────────────

type BlogWithCount = Prisma.BlogGetPayload<{
  include: { _count: { select: { comments: true; likes: true } } };
}>;

type BlogEditData = Prisma.BlogGetPayload<{
  include: { htmlContent: { select: { content: true } } };
}>;

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createBlog(
  input: CreateBlogInput,
): Promise<ActionResult<{ blogId: string }>> {
  const { title, desc, category, keywords, image, status, lang, content } =
    input;

  if (!title || !desc || !category || !image || !lang) {
    return { success: false, error: "Missing required fields" };
  }

  if (!content || content.length === 0) {
    return { success: false, error: "Content must not be empty" };
  }

  try {
    const blog = await prisma.blog.create({
      data: {
        title,
        desc,
        category,
        keywords: keywords ?? [],
        image,
        status: status ?? "show",
        lang,
        htmlContent: { create: { content } },
      },
      select: { id: true },
    });

    revalidateBlogPaths();
    return { success: true, data: { blogId: blog.id } };
  } catch (error: unknown) {
    if (getPrismaCode(error) === "P2002") {
      return { success: false, error: "A blog with this title already exists" };
    }
    console.error("[createBlog]", error);
    return { success: false, error: "Failed to create blog" };
  }
}

// ─── Get All (with filters) ───────────────────────────────────────────────────

export async function getBlogs(filters: GetBlogsFilters = {}): Promise<
  ActionResult<{
    blogs: BlogWithCount[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }>
> {
  const { lang, category, status, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(lang && { lang }),
    ...(category && { category }),
    ...(status && { status }),
  };

  try {
    const [blogs, total] = await prisma.$transaction([
      prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { comments: true, likes: true } },
        },
      }),
      prisma.blog.count({ where }),
    ]);

    return {
      success: true,
      data: {
        blogs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("[getBlogs]", error);
    return { success: false, error: "Failed to fetch blogs" };
  }
}

// ─── Get By ID / Title / Edit ─────────────────────────────────────────────────

export async function getBlogById(
  id: string,
): Promise<
  ActionResult<NonNullable<Awaited<ReturnType<typeof fetchBlogById>>>>
> {
  try {
    const blog = await fetchBlogById(id);

    if (!blog) return { success: false, error: "Blog not found" };

    return { success: true, data: blog };
  } catch (error) {
    console.error("[getBlogById]", error);
    return { success: false, error: "Failed to fetch blog" };
  }
}

export async function getBlogByTitle(
  title: string,
): Promise<
  ActionResult<NonNullable<Awaited<ReturnType<typeof fetchBlogByTitle>>>>
> {
  try {
    const blog = await fetchBlogByTitle(title);

    if (!blog) return { success: false, error: "Blog not found" };

    return { success: true, data: blog };
  } catch (error) {
    console.error("[getBlogByTitle]", error);
    return { success: false, error: "Failed to fetch blog" };
  }
}

export async function getBlogForEdit(
  id: string,
): Promise<ActionResult<BlogEditData>> {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: { htmlContent: { select: { content: true } } },
    });

    if (!blog) return { success: false, error: "Blog not found" };

    return { success: true, data: blog };
  } catch (error) {
    console.error("[getBlogForEdit]", error);
    return { success: false, error: "Failed to fetch blog" };
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateBlog(
  id: string,
  input: UpdateBlogInput,
): Promise<ActionResult<{ blogId: string }>> {
  const { content, ...blogFields } = input;

  if (hasEmptyField(input)) {
    return { success: false, error: "Missing required fields" };
  }

  const hasContent = !!content && content.length > 0;

  try {
    await prisma.blog.update({
      where: { id },
      data: {
        ...blogFields,
        ...(hasContent && { htmlContent: { update: { content } } }),
      },
    });

    revalidateBlogPaths(id);
    return { success: true, data: { blogId: id } };
  } catch (error: unknown) {
    const code = getPrismaCode(error);

    if (code === "P2002") {
      return { success: false, error: "A blog with this title already exists" };
    }
    if (code === "P2025") {
      return { success: false, error: "Blog not found" };
    }
    console.error("[updateBlog]", error);
    return { success: false, error: "Failed to update blog" };
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteBlog(
  id: string,
): Promise<ActionResult<{ blogId: string }>> {
  try {
    const existing = await prisma.blog.findUnique({
      where: { id },
      select: { contentId: true },
    });

    if (!existing) return { success: false, error: "Blog not found" };

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.comment.deleteMany({ where: { blogId: id } });
      await tx.like.deleteMany({ where: { blogId: id } });
      await tx.blog.delete({ where: { id } });
      await tx.htmlContent.delete({ where: { id: existing.contentId } });
    });

    revalidateBlogPaths(id);
    return { success: true, data: { blogId: id } };
  } catch (error) {
    console.error("[deleteBlog]", error);
    return { success: false, error: "Failed to delete blog" };
  }
}

// ─── Internal Fetchers ────────────────────────────────────────────────────────

const blogDetailsInclude = {
  htmlContent: { select: { content: true } },
  comments: { orderBy: { createdAt: "desc" } },
  _count: { select: { comments: true, likes: true } },
} satisfies Prisma.BlogInclude;

async function fetchBlogById(id: string) {
  return prisma.blog.findUnique({ where: { id }, include: blogDetailsInclude });
}

async function fetchBlogByTitle(title: string) {
  return prisma.blog.findUnique({
    where: { title },
    include: blogDetailsInclude,
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const REQUIRED_FIELDS = ["title", "desc", "category", "image", "lang"] as const;

function hasEmptyField(input: UpdateBlogInput): boolean {
  return REQUIRED_FIELDS.some((key) => input[key] !== undefined && !input[key]);
}

function revalidateBlogPaths(id?: string) {
  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath("/blog");

  if (id) {
    revalidatePath(`/blogs/${id}`);
    revalidatePath(`/blog/${id}`);
  }
}

function getPrismaCode(error: unknown): string | null {
  if (typeof error === "object" && error !== null && "code" in error) {
    const { code } = error as { code: unknown };
    return typeof code === "string" ? code : null;
  }
  return null;
}
