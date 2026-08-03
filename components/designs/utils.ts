export function formatDate(date?: Date | null) {
  if (!date) return null;

  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function rootNavigation(
  items: Array<{ id: string; label: string; href: string; order: number; parentId: string | null }>
) {
  return items
    .filter((item) => !item.parentId)
    .sort((a, b) => a.order - b.order);
}
