"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createArticle(formData: FormData) {
  const siteId = formData.get("siteId") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const featuredImage = formData.get("featuredImage") as string;
  const status = formData.get("status") as string;

  if (!siteId || !title || !slug || !content) {
    throw new Error("Missing required fields");
  }

  await prisma.article.create({
    data: {
      siteId,
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      status: status || "DRAFT",
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/(site)", "layout");
  redirect("/admin/articles");
}

export async function updateArticle(id: string, formData: FormData) {
  const siteId = formData.get("siteId") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const featuredImage = formData.get("featuredImage") as string;
  const status = formData.get("status") as string;

  if (!siteId || !title || !slug || !content) {
    throw new Error("Missing required fields");
  }

  await prisma.article.update({
    where: { id },
    data: {
      siteId,
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      status: status || "DRAFT",
    },
  });

  revalidatePath("/admin/articles");
  revalidatePath(`/(site)/articles/${slug}`, "page");
  revalidatePath("/(site)", "layout");
  redirect("/admin/articles");
}

export async function deleteArticle(id: string) {
  await prisma.article.delete({
    where: { id },
  });

  revalidatePath("/admin/articles");
  revalidatePath("/(site)", "layout");
}
