"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addNavigationItem(siteId: string, formData: FormData) {
  const label = formData.get("label") as string;
  const href = formData.get("href") as string;
  const order = parseInt(formData.get("order") as string || "0");

  if (!label || !href) {
    throw new Error("Label and Href are required");
  }

  await prisma.navigationItem.create({
    data: {
      siteId,
      label,
      href,
      order,
    },
  });

  revalidatePath(`/admin/navigation/${siteId}`);
  revalidatePath("/(site)", "layout");
}

export async function deleteNavigationItem(siteId: string, id: string) {
  await prisma.navigationItem.delete({
    where: { id },
  });

  revalidatePath(`/admin/navigation/${siteId}`);
  revalidatePath("/(site)", "layout");
}

export async function updateNavigationOrder(siteId: string, items: { id: string, order: number }[]) {
  // Batch update orders
  const updates = items.map(item => 
    prisma.navigationItem.update({
      where: { id: item.id },
      data: { order: item.order }
    })
  );

  await prisma.$transaction(updates);

  revalidatePath(`/admin/navigation/${siteId}`);
  revalidatePath("/(site)", "layout");
}
