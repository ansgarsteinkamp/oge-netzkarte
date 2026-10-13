import { adjacentOperatorLabel, gasQualityLabel, operatorReferenceLabel, pipelineStatusExceptionLabel, pointCategoryLabel, pointGasQualityLabel, relationDetailDescription } from "./formatters.js";

// Shared detail rows for the selection panel and the map tooltips.
const row = (label, value) => ({ label, value });

export const getPointDetailRows = point => [
   row("Gasqualität", pointGasQualityLabel(point.gas_quality)),
   point.adjacent_country && row("Anbindung", point.adjacent_country),
   point.adjacent_operator && row(adjacentOperatorLabel(point.category), point.adjacent_operator),
   point.vip_name && row("VIP", point.vip_name),
   point.zone && row("Zone", point.zone),
   row("Punktkategorie", pointCategoryLabel(point.category))
].filter(Boolean);

export const getPipelineDetailRows = feature => {
   const props = feature.properties;
   const status = pipelineStatusExceptionLabel(props.status);

   return [
      props.name !== props.line_name && row("Abschnitt", props.name ?? "unbekannt"),
      row("OGE-Bezug", relationDetailDescription(props.oge_role) ?? "unbekannt"),
      status && row("Status", status),
      row("Gasqualität", gasQualityLabel(props.gas_quality)),
      row(operatorReferenceLabel(props.oge_role), props.operator ?? "unbekannt"),
      row("Quelle", props.source ?? "unbekannt")
   ].filter(Boolean);
};
