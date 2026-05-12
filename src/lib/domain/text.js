export const stripBom = value => value.replace(/^\uFEFF/, "");

export const normalize = value =>
   String(value ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
