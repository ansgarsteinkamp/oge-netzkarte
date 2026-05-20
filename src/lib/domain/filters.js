import { ALL_VALUE, PIPELINE_GAS_FILTER_VALUES, RELATION_FILTERS } from "./constants.js";

const getPipelineGasFilterValue = value => PIPELINE_GAS_FILTER_VALUES[value] ?? value;

export const matchesPipelineGas = (gasQuality, selectedGasType) => selectedGasType === ALL_VALUE || getPipelineGasFilterValue(gasQuality) === selectedGasType;

export const matchesPointGas = (gasQuality, selectedGasType) => selectedGasType === ALL_VALUE || gasQuality === selectedGasType;

export const matchesPipelineRelation = (relationType, selectedRelation) => {
   if (selectedRelation === ALL_VALUE) return true;

   const filter = RELATION_FILTERS.find(item => item.value === selectedRelation);
   return filter?.relationTypes.includes(relationType) ?? relationType === selectedRelation;
};
