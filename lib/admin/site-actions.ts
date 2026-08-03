"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { normalizeHostname } from "@/lib/utils/hostname";

export async function createSite(formData: FormData) {
  const name = formData.get("name") as string;
  const brandName = formData.get("brandName") as string;
  const slug = formData.get("slug") as string;
  const hostname = formData.get("hostname") as string;
  const description = formData.get("description") as string;
  const designKey = formData.get("designKey") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const secondaryColor = formData.get("secondaryColor") as string;

  if (!name || !brandName || !slug || !hostname) {
    throw new Error("Missing required fields");
  }

  const normalizedHostname = normalizeHostname(hostname);

  await prisma.site.create({
    data: {
      name,
      brandName,
      slug,
      description,
      status: "ACTIVE",
      domains: {
        create: { hostname: normalizedHostname, isPrimary: true },
      },
      navigationItems: {
        createMany: {
          data: [
            { label: "Accueil", href: "/", order: 0 },
            { label: "Articles", href: "/articles", order: 1 },
            { label: "À propos", href: "/about", order: 2 },
          ],
        },
      },
      themeSettings: {
        create: {
          primaryColor: primaryColor || "#3b82f6",
          secondaryColor: secondaryColor || "#64748b",
          designKey: designKey || "default",
        },
      },
      seoSettings: {
        create: {
          titleTemplate: `%s | ${brandName}`,
        },
      },
    },
  });

  revalidatePath("/admin/sites");
  redirect("/admin/sites");
}

export async function updateSite(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const brandName = formData.get("brandName") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const designKey = formData.get("designKey") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const secondaryColor = formData.get("secondaryColor") as string;

  if (!name || !brandName || !slug) {
    throw new Error("Missing required fields");
  }

  await prisma.site.update({
    where: { id },
    data: {
      name,
      brandName,
      slug,
      description,
      themeSettings: {
        upsert: {
          create: {
            primaryColor: primaryColor || "#3b82f6",
            secondaryColor: secondaryColor || "#64748b",
            designKey: designKey || "default",
          },
          update: {
            primaryColor: primaryColor || "#3b82f6",
            secondaryColor: secondaryColor || "#64748b",
            designKey: designKey || "default",
          },
        },
      },
    },
  });

  revalidatePath("/admin/sites");
  revalidatePath("/(site)", "layout");
  redirect("/admin/sites");
}

export async function deleteSite(id: string) {
  await prisma.site.delete({
    where: { id },
  });

  revalidatePath("/admin/sites");
}

export async function updateGeoSettings(siteId: string, formData: FormData) {
  const city = formData.get("city") as string;
  const region = formData.get("region") as string;
  const country = (formData.get("country") as string) || "France";
  const persona = (formData.get("persona") as string) || "expert";
  const writingTone = (formData.get("writingTone") as string) || "informatif";
  const audienceDesc = formData.get("audienceDesc") as string;
  const locale = (formData.get("locale") as string) || "fr";

  await prisma.geoSettings.upsert({
    where: { siteId },
    create: {
      siteId,
      city,
      region,
      country,
      persona,
      writingTone,
      audienceDesc,
      locale,
    },
    update: {
      city,
      region,
      country,
      persona,
      writingTone,
      audienceDesc,
      locale,
    },
  });

  revalidatePath(`/admin/sites/${siteId}/geo`);
  revalidatePath("/(site)", "layout");
}
