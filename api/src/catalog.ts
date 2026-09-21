export type { SefiraCatalog, SefiraSlug, TextEntry } from "../../shared/texts.js";
export {
  INTRO,
  TEXTS,
  SEFIRA_META,
  SEFIRA_ORDER,
  buildSefirot,
  solutionFor,
  solutionByKey
} from "../../shared/texts.js";

import { buildSefirot } from "../../shared/texts.js";

/** Catalogul sefirot + întrebări (derivat din cheile din shared/texts.ts). */
export const SEFIROT = buildSefirot();
