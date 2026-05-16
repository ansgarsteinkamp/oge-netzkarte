import { PIPELINE_GAS_LABELS, PIPELINE_STATUS_LABELS, RELATION_DETAIL_DESCRIPTIONS, RELATION_LABELS } from "./constants.js";

export const relationLabel = value => RELATION_LABELS[value] ?? value;

export const relationDetailDescription = value => RELATION_DETAIL_DESCRIPTIONS[value] ?? relationLabel(value);

export const gasQualityLabel = value => PIPELINE_GAS_LABELS[value] ?? value ?? "unbekannt";

const pipelineStatusLabel = value => PIPELINE_STATUS_LABELS[value] ?? value ?? "unbekannt";

const isDefaultPipelineStatus = value => value === "operating";

export const pipelineStatusExceptionLabel = value => (isDefaultPipelineStatus(value) ? null : pipelineStatusLabel(value));

export const operatorReferenceLabel = role => {
   if (role === "operator" || role === "owned_affiliate") return "Betreiber";
   return "Betreiber/Partner";
};

export const cleanName = featureLike => {
   const props = featureLike.properties ?? featureLike;
   return props.line_name || props.name || props.id || "Leitung";
};

export const pointTypeLabel = value => (value === "NKP-GÜ" ? "GÜP" : value === "NKP-MAP" ? "MAP" : value);

export const mainDirectionLabel = value => (value === "Einspeisung" ? "Entry" : value === "Ausspeisung" ? "Exit" : value === null ? "Beidseitig" : value);
