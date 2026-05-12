import { RELATION_LABELS } from "./constants.js";

const mojibakePattern = /[\u00C2\u00C3\uFFFD]/;

export const formatNumber = (value, digits = 1) => (Number.isFinite(value) ? value.toLocaleString("de-DE", { maximumFractionDigits: digits }) : "unbekannt");

export const formatValue = (value, suffix = "") => (value === null || value === undefined || value === "" ? "unbekannt" : `${formatNumber(value)}${suffix}`);

export const cleanName = featureLike => {
   const props = featureLike.properties ?? featureLike;
   if (typeof props.name === "string" && mojibakePattern.test(props.name)) return props.route_label || props.operator || props.id || "Leitung";
   return props.route_label || props.name || props.id || "Leitung";
};

export const pointTypeLabel = value => (value === "NKP-GÜ" ? "GÜP" : value === "NKP-MAP" ? "MAP" : value);

export const mainDirectionLabel = value => (value === "Einspeisung" ? "Entry" : value === "Ausspeisung" ? "Exit" : value === null ? "Beidseitig" : value);

export const relationLabel = value => RELATION_LABELS[value] ?? value;

export const routeLabel = value => {
   const labels = {
      joint_operator_unclassified: "Gemeinsam",
      oge_direct_unclassified: "OGE direkt"
   };

   return labels[value] ?? value.toUpperCase();
};
