import { GAS_QUALITY_LABELS, PIPELINE_GAS_LABELS, PIPELINE_STATUS_LABELS, POINT_CATEGORY_LABELS, RELATION_DETAIL_DESCRIPTIONS, RELATION_LABELS } from "./constants.js";

export const relationLabel = value => RELATION_LABELS[value] ?? value;

export const relationDetailDescription = value => RELATION_DETAIL_DESCRIPTIONS[value] ?? relationLabel(value);

export const gasQualityLabel = value => PIPELINE_GAS_LABELS[value] ?? value ?? "unbekannt";

export const pointGasQualityLabel = value => GAS_QUALITY_LABELS[value] ?? value ?? "unbekannt";

export const pointCategoryLabel = value => POINT_CATEGORY_LABELS[value] ?? value ?? "unbekannt";

export const formatCoordinate = value => (Number.isFinite(value) ? String(value).replace(".", ",") : "unbekannt");

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
