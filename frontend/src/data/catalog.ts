export type { SefiraCatalog, SefiraSlug, TextEntry } from "../../../shared/texts";
export { INTRO, TEXTS, SEFIRA_META, SEFIRA_ORDER, buildSefirot, solutionFor, solutionByKey } from "../../../shared/texts";

import { buildSefirot } from "../../../shared/texts";

/** Catalogul sefirot + întrebări (derivat din cheile din shared/texts.ts). */
export const SEFIROT = buildSefirot();
