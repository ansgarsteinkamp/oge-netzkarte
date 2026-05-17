import { cleanName, gasQualityLabel, pipelineStatusExceptionLabel, pointCategoryLabel, pointGasQualityLabel, relationLabel } from "./formatters.js";
import { includesSearchQuery, normalize } from "./text.js";

const MIN_SEARCH_LENGTH = 2;

export const getSearchQuery = searchTerm => normalize(searchTerm);

export const isSearchActive = query => query.length >= MIN_SEARCH_LENGTH;

export const pipelineMatchesSearch = (feature, query, hasActiveSearch) => {
   if (!hasActiveSearch) return true;

   const props = feature.properties;
   return [
      props.id,
      props.name,
      props.line_name,
      props.system_id,
      props.operator,
      props.source,
      props.gas_quality,
      gasQualityLabel(props.gas_quality),
      pipelineStatusExceptionLabel(props.status),
      props.oge_role,
      relationLabel(props.oge_role)
   ]
      .some(value => includesSearchQuery(value, query));
};

export const pointSearchTokens = point => [
   point.name,
   point.vip_name,
   point.zone,
   ...(point.points ?? []).flatMap(item => [item.label, item.location_id, item.eic])
];

export const pointMatchesSearch = (point, query, hasActiveSearch) => {
   if (!hasActiveSearch) return true;

   return pointSearchTokens(point).some(value => includesSearchQuery(value, query));
};

export const getPointSearchMatch = (point, query, hasActiveSearch) => {
   if (!hasActiveSearch) return null;

   const matches = value => includesSearchQuery(value, query);

   for (const childPoint of point.points ?? []) {
      if (matches(childPoint.location_id)) return { label: `Treffer: ${childPoint.location_id}`, technicalPoint: childPoint };
      if (matches(childPoint.eic)) return { label: `Treffer: ${childPoint.eic}`, technicalPoint: childPoint };
      if (matches(childPoint.label)) return { label: `Treffer: ${childPoint.label}`, technicalPoint: childPoint };
   }

   if (matches(point.vip_name)) return { label: `Treffer: ${point.vip_name}` };
   if (matches(point.zone)) return { label: `Treffer: ${point.zone}` };

   return null;
};

export const pointResultMeta = (point, match) =>
   [pointCategoryLabel(point.category), pointGasQualityLabel(point.gas_quality), match].filter(Boolean).join(" · ");

export const toResultItems = ({ filteredPipelines, filteredPoints, hasActiveSearch, layerVisibility, query }) => {
   const pointResults = layerVisibility.showPoints
      ? filteredPoints.map(item => {
         const match = getPointSearchMatch(item, query, hasActiveSearch);
         return { kind: "point", item, match: match?.label, technicalPoint: match?.technicalPoint };
      })
      : [];
   const pipelineResults = layerVisibility.showPipelines ? filteredPipelines.features.map(item => ({ kind: "pipeline", item, title: cleanName(item) })) : [];

   return [...pointResults, ...pipelineResults];
};
