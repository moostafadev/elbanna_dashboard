"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getViews = async (slug: string): Promise<number> => {
  const view = await prisma.views.findUnique({
    where: { slug },
  });

  return view?.count || 0;
};

export const createView = async (slug: string) => {
  await prisma.views.upsert({
    where: { slug },
    update: { count: { increment: 1 } },
    create: { slug, count: 1 },
  });
};
