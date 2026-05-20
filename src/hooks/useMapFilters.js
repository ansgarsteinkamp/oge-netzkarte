import { useMemo, useState } from "react";

import { ALL_VALUE, DEFAULT_GAS_QUALITY } from "@/lib/domain/constants";
import { getPointBoundsLatLngs, lineStringToLatLngs } from "@/lib/domain/coordinates";
import { buildFilterOptions } from "@/lib/domain/facets";
import { matchesPipelineGas, matchesPipelineRelation, matchesPointGas } from "@/lib/domain/filters";
import { pipelineMatchesSearch, getSearchQuery, isSearchActive, pointMatchesSearch, toResultItems } from "@/lib/domain/search";

const initialLayerVisibility = {
   showPipelines: true,
   showPoints: true
};

export function useMapFilters({ pipelineCollection, points }) {
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedRelation, setSelectedRelation] = useState(ALL_VALUE);
   const [selectedPointCategory, setSelectedPointCategory] = useState(ALL_VALUE);
   const [selectedGasType, setSelectedGasType] = useState(DEFAULT_GAS_QUALITY);
   const [layerVisibility, setLayerVisibility] = useState(initialLayerVisibility);

   const filterOptions = useMemo(() => buildFilterOptions({ points }), [points]);
   const query = getSearchQuery(searchTerm);
   const hasActiveSearch = isSearchActive(query);

   const filteredPipelines = useMemo(() => {
      return {
         ...pipelineCollection,
         features: pipelineCollection.features.filter(item => {
            const props = item.properties;
            return matchesPipelineRelation(props.oge_role, selectedRelation) && matchesPipelineGas(props.gas_quality, selectedGasType) && pipelineMatchesSearch(item, query, hasActiveSearch);
         })
      };
   }, [hasActiveSearch, pipelineCollection, query, selectedGasType, selectedRelation]);

   const filteredPoints = useMemo(() => {
      return points.filter(point => {
         const matchesCategory = selectedPointCategory === ALL_VALUE || point.category === selectedPointCategory;
         const matchesGas = matchesPointGas(point.gas_quality, selectedGasType);

         return matchesCategory && matchesGas && pointMatchesSearch(point, query, hasActiveSearch);
      });
   }, [hasActiveSearch, points, query, selectedGasType, selectedPointCategory]);

   const searchBounds = useMemo(() => {
      if (!hasActiveSearch) return [];

      const latLngs = [];
      if (layerVisibility.showPipelines) {
         filteredPipelines.features.forEach(item => {
            latLngs.push(...lineStringToLatLngs(item));
         });
      }
      if (layerVisibility.showPoints) {
         filteredPoints.forEach(point => latLngs.push(...getPointBoundsLatLngs(point)));
      }

      return latLngs;
   }, [filteredPipelines, filteredPoints, hasActiveSearch, layerVisibility.showPipelines, layerVisibility.showPoints]);

   const results = useMemo(() => {
      if (!hasActiveSearch) {
         return {
            active: false,
            items: [],
            total: 0
         };
      }

      const items = toResultItems({ filteredPipelines, filteredPoints, hasActiveSearch, layerVisibility, query });
      return {
         active: true,
         items,
         total: items.length
      };
   }, [filteredPipelines, filteredPoints, hasActiveSearch, layerVisibility, query]);

   const pipelineLayerKey = JSON.stringify([selectedRelation, selectedGasType, hasActiveSearch ? query : ""]);

   const resetFilters = () => {
      setSearchTerm("");
      setSelectedRelation(ALL_VALUE);
      setSelectedPointCategory(ALL_VALUE);
      setSelectedGasType(DEFAULT_GAS_QUALITY);
      setLayerVisibility(initialLayerVisibility);
   };

   const toggleLayer = key => {
      setLayerVisibility(prev => ({ ...prev, [key]: !prev[key] }));
   };

   return {
      filteredPipelines,
      filteredPoints,
      filterOptions,
      hasActiveSearch,
      layerVisibility,
      pipelineLayerKey,
      resetFilters,
      results,
      searchBounds,
      searchTerm,
      selectedGasType,
      selectedPointCategory,
      selectedRelation,
      setSearchTerm,
      setSelectedGasType,
      setSelectedPointCategory,
      setSelectedRelation,
      toggleLayer
   };
}
