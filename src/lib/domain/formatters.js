import { RELATION_LABELS } from "./constants.js";

const formatNumber = (value, digits = 1) => (Number.isFinite(value) ? value.toLocaleString("de-DE", { maximumFractionDigits: digits }) : "unbekannt");

const GENERIC_ROUTE_LABELS = {
   "Joint operator": "Gemeinsam",
   "OGE direct": "OGE direkt"
};

export const formatValue = (value, suffix = "") => (value === null || value === undefined || value === "" ? "unbekannt" : `${formatNumber(value)}${suffix}`);

export const relationLabel = value => RELATION_LABELS[value] ?? value;

export const routeDisplayLabel = props => GENERIC_ROUTE_LABELS[props.route_label] ?? props.route_label ?? relationLabel(props.relation_type);

export const cleanName = featureLike => {
   const props = featureLike.properties ?? featureLike;
   return props.route_label ? routeDisplayLabel(props) : props.name || props.id || "Leitung";
};

export const pointTypeLabel = value => (value === "NKP-GÜ" ? "GÜP" : value === "NKP-MAP" ? "MAP" : value);

export const mainDirectionLabel = value => (value === "Einspeisung" ? "Entry" : value === "Ausspeisung" ? "Exit" : value === null ? "Beidseitig" : value);
