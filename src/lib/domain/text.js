export const stripBom = value => value.replace(/^\uFEFF/, "");

const normalizeBase = value =>
   String(value ?? "")
      .trim()
      .toLowerCase();

export const normalize = value =>
   normalizeBase(value)
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

const normalizeGermanTransliteration = value =>
   normalizeBase(value)
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

export const normalizeSearchVariants = value => [...new Set([normalize(value), normalizeGermanTransliteration(value)])];

export const includesSearchQuery = (value, query) =>
   normalizeSearchVariants(value).some(valueVariant => normalizeSearchVariants(query).some(queryVariant => valueVariant.includes(queryVariant)));
