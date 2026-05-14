import { useMemo, useState } from "react";

import { ALL_VALUE, DEFAULT_GAS_TYPE } from "@/lib/domain/constants";
import { buildFilterOptions } from "@/lib/domain/facets";
import { matchesPipelineGas, matchesPipelineRelation } from "@/lib/domain/filters";
import { pipelineMatchesSearch, getSearchQuery, isSearchActive, pointMatchesSearch, toResultItems } from "@/lib/domain/search";

const initialLayerVisibility = {
   showPipelines: true,
   showPoints: true
};

export function useMapFilters({ pipelineCollection, pointOffsets, points }) {
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedRelation, setSelectedRelation] = useState(ALL_VALUE);
   const [selectedPointType, setSelectedPointType] = useState(ALL_VALUE);
   const [selectedGasType, setSelectedGasType] = useState(DEFAULT_GAS_TYPE);
   const [selectedMainDirection, setSelectedMainDirection] = useState(ALL_VALUE);
   const [layerVisibility, setLayerVisibility] = useState(initialLayerVisibility);

   const filterOptions = useMemo(() => buildFilterOptions({ points }), [points]);
   const query = getSearchQuery(searchTerm);
   const hasActiveSearch = isSearchActive(query);

   const filteredPipelines = useMemo(() => {
      return {
         ...pipelineCollection,
         features: pipelineCollection.features.filter(item => {
            const props = item.properties;
            return matchesPipelineRelation(props.relation_type, selectedRelation) && matchesPipelineGas(props.gas_quality, selectedGasType) && pipelineMatchesSearch(item, query, hasActiveSearch);
         })
      };
   }, [hasActiveSearch, pipelineCollection, query, selectedGasType, selectedRelation]);

   const filteredPoints = useMemo(() => {
      return points.filter(point => {
         const matchesType = selectedPointType === ALL_VALUE || point.point_type === selectedPointType;
         const matchesMainDirection = selectedMainDirection === ALL_VALUE || point.direction === selectedMainDirection;
         const matchesGas = point.gas_type === selectedGasType;

         return matchesType && matchesMainDirection && matchesGas && pointMatchesSearch(point, query, hasActiveSearch);
      });
   }, [hasActiveSearch, points, query, selectedGasType, selectedMainDirection, selectedPointType]);

   const searchBounds = useMemo(() => {
      if (!hasActiveSearch) return [];

      const latLngs = [];
      if (layerVisibility.showPipelines) {
         filteredPipelines.features.forEach(item => {
            item.geometry.coordinates.forEach(([longitude, latitude]) => latLngs.push([latitude, longitude]));
         });
      }
      if (layerVisibility.showPoints) {
         filteredPoints.forEach(point => latLngs.push(pointOffsets.get(point.id) ?? [point.latitude, point.longitude]));
      }

      return latLngs;
   }, [filteredPipelines, filteredPoints, hasActiveSearch, layerVisibility.showPipelines, layerVisibility.showPoints, pointOffsets]);

   const results = useMemo(() => {
      if (!hasActiveSearch) {
         return {
            active: false,
            items: [],
            total: 0
         };
      }

      const items = toResultItems({ filteredPipelines, filteredPoints, layerVisibility });
      return {
         active: true,
         items,
         total: items.length
      };
   }, [filteredPipelines, filteredPoints, hasActiveSearch, layerVisibility]);

   const pipelineLayerKey = JSON.stringify([selectedRelation, selectedGasType, hasActiveSearch ? query : ""]);

   const resetFilters = () => {
      setSearchTerm("");
      setSelectedRelation(ALL_VALUE);
      setSelectedPointType(ALL_VALUE);
      setSelectedGasType(DEFAULT_GAS_TYPE);
      setSelectedMainDirection(ALL_VALUE);
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
      selectedMainDirection,
      selectedPointType,
      selectedRelation,
      setSearchTerm,
      setSelectedGasType,
      setSelectedMainDirection,
      setSelectedPointType,
      setSelectedRelation,
      toggleLayer
   };
}
