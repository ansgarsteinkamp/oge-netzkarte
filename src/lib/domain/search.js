import { cleanName, mainDirectionLabel } from "./formatters.js";
import { normalize } from "./text.js";

export const MIN_SEARCH_LENGTH = 2;

export const getSearchQuery = searchTerm => normalize(searchTerm);

export const isSearchActive = query => query.length >= MIN_SEARCH_LENGTH;

export const pipelineMatchesSearch = (feature, query, hasActiveSearch) => {
   if (!hasActiveSearch) return true;

   const props = feature.properties;
   return [props.id, props.name, props.route_label, props.operator, props.source_operator, ...(props.owners ?? []), ...(props.co_owners ?? []), props.gas_quality]
      .map(normalize)
      .some(value => value.includes(query));
};

export const pointMatchesSearch = (point, query, hasActiveSearch) => {
   if (!hasActiveSearch) return true;

   return [point.id, point.name, point.point_type, point.direction, mainDirectionLabel(point.direction), point.gas_type].map(normalize).some(value => value.includes(query));
};

export const toResultItems = ({ filteredPipelines, filteredPoints, layerVisibility }) => {
   const pointResults = layerVisibility.showPoints ? filteredPoints.map(item => ({ kind: "point", item })) : [];
   const pipelineResults = layerVisibility.showPipelines ? filteredPipelines.features.map(item => ({ kind: "pipeline", item, title: cleanName(item) })) : [];

   return [...pointResults, ...pipelineResults];
};
