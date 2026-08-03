"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCampaign(formData: FormData) {
  const name = formData.get("name") as string;
  const productName = formData.get("productName") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const specs = formData.get("specs") as string;
  const keywords = formData.get("keywords") as string;
  const competitors = formData.get("competitors") as string;
  const externalSources = formData.get("externalSources") as string;
  const strategy = formData.get("strategy") as string;
  const images = formData.get("images") as string;
  const targetUrl = formData.get("targetUrl") as string;

  if (!name || !productName || !description) {
    throw new Error("Missing required fields");
  }

  const campaign = await prisma.campaign.create({
    data: {
      name,
      productName,
      category,
      description,
      specs,
      keywords,
      competitors,
      externalSources,
      strategy,
      images,
      targetUrl,
      status: "DRAFT",
    },
  });

  revalidatePath("/admin/campaigns");
  redirect(`/admin/campaigns/${campaign.id}`);
}

export async function updateCampaign(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const productName = formData.get("productName") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const specs = formData.get("specs") as string;
  const keywords = formData.get("keywords") as string;
  const competitors = formData.get("competitors") as string;
  const externalSources = formData.get("externalSources") as string;
  const strategy = formData.get("strategy") as string;
  const images = formData.get("images") as string;
  const targetUrl = formData.get("targetUrl") as string;

  if (!name || !productName || !description) {
    throw new Error("Missing required fields");
  }

  await prisma.campaign.update({
    where: { id },
    data: {
      name,
      productName,
      category,
      description,
      specs,
      keywords,
      competitors,
      externalSources,
      strategy,
      images,
      targetUrl,
    },
  });

  revalidatePath(`/admin/campaigns/${id}`);
}

export async function deleteCampaign(id: string) {
  await prisma.campaign.delete({
    where: { id },
  });

  revalidatePath("/admin/campaigns");
}
