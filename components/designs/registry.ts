import { decoDesign } from "./deco";
import { guideDesign } from "./guide";
import { MagazineDesign } from "./magazine";
import type { SiteDesign } from "./types";

export const DESIGNS: Record<string, SiteDesign> = {
  default: decoDesign,
  deco: decoDesign,
  guide: guideDesign,
  magazine: MagazineDesign,
};

/**
 * Centralized design resolver.
 *
 * New tenant designs should be registered here and selected through
 * ThemeSettings.designKey, not by branching on site.slug inside pages.
 */
export function getDesign(designKey: string): SiteDesign {
  return DESIGNS[designKey] ?? DESIGNS.default;
}
