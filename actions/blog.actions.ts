"use server";

import { prisma } from "@/lib/prisma";
import { LANG, Prisma, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

type CreateBlogInput = {
  title: string;
  desc: string;
  category: string;
  keywords: string[];
  image: string;
  status?: Status;
  lang: LANG | "";
  content: string[];
};

type UpdateBlogInput = Partial<Omit<CreateBlogInput, "content">> & {
  content?: string[];
};

type GetBlogsFilters = {
  lang?: LANG;
  category?: string;
  status?: Status;
  page?: number;
  limit?: number;
};

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
    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const htmlContent = await tx.htmlContent.create({
          data: { content },
        });

        const blog = await tx.blog.create({
          data: {
            title,
            desc,
            category,
            keywords: keywords ?? [],
            image,
            status: status ?? "show",
            lang,
            contentId: htmlContent.id,
          },
        });

        return blog;
      },
    );

    revalidatePath("/blog");
    return { success: true, data: { blogId: result.id } };
  } catch (error: unknown) {
    if (isPrismaUniqueError(error)) {
      return { success: false, error: "A blog with this title already exists" };
    }
    console.error("[createBlog]", error);
    return { success: false, error: "Failed to create blog" };
  }
}

// ─── Get All (with filters) ───────────────────────────────────────────────────

type BlogWithCount = Prisma.BlogGetPayload<{
  include: { _count: { select: { comments: true; likes: true } } };
}>;

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

// ─── Get By ID or Slug (title) ────────────────────────────────────────────────

export async function getBlogById(
  id: string,
): Promise<ActionResult<Awaited<ReturnType<typeof fetchBlogById>>>> {
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
): Promise<ActionResult<Awaited<ReturnType<typeof fetchBlogByTitle>>>> {
  try {
    const blog = await fetchBlogByTitle(title);

    if (!blog) return { success: false, error: "Blog not found" };

    return { success: true, data: blog };
  } catch (error) {
    console.error("[getBlogByTitle]", error);
    return { success: false, error: "Failed to fetch blog" };
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateBlog(
  id: string,
  input: UpdateBlogInput,
): Promise<ActionResult<{ blogId: string }>> {
  const { content, ...blogFields } = input;

  try {
    const existing = await prisma.blog.findUnique({
      where: { id },
      select: { contentId: true },
    });

    if (!existing) return { success: false, error: "Blog not found" };

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      if (content && content.length > 0) {
        await tx.htmlContent.update({
          where: { id: existing.contentId },
          data: { content },
        });
      }

      if (Object.keys(blogFields).length > 0) {
        await tx.blog.update({
          where: { id },
          data: blogFields,
        });
      }
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${id}`);
    return { success: true, data: { blogId: id } };
  } catch (error: unknown) {
    if (isPrismaUniqueError(error)) {
      return { success: false, error: "A blog with this title already exists" };
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
      // Delete related records first
      await tx.comment.deleteMany({ where: { blogId: id } });
      await tx.like.deleteMany({ where: { blogId: id } });
      await tx.blog.delete({ where: { id } });
      await tx.htmlContent.delete({ where: { id: existing.contentId } });
    });

    revalidatePath("/blog");
    return { success: true, data: { blogId: id } };
  } catch (error) {
    console.error("[deleteBlog]", error);
    return { success: false, error: "Failed to delete blog" };
  }
}

// ─── Internal Fetchers ────────────────────────────────────────────────────────

async function fetchBlogById(id: string) {
  return prisma.blog.findUnique({
    where: { id },
    include: {
      comments: { orderBy: { createdAt: "desc" } },
      _count: { select: { comments: true, likes: true } },
    },
  });
}

async function fetchBlogByTitle(title: string) {
  return prisma.blog.findUnique({
    where: { title },
    include: {
      comments: { orderBy: { createdAt: "desc" } },
      _count: { select: { comments: true, likes: true } },
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isPrismaUniqueError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}
