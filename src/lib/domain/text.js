export const stripBom = value => value.replace(/^\uFEFF/, "");

export const normalize = value =>
   String(value ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
