import { ALL_VALUE, RELATION_FILTERS } from "./constants.js";

export const getPipelineGasFilterValue = value => (typeof value === "string" && value.includes("L-Gas") ? "L-Gas" : value);

export const matchesPipelineGas = (gasQuality, selectedGasType) => selectedGasType === ALL_VALUE || getPipelineGasFilterValue(gasQuality) === selectedGasType;

export const matchesPipelineRelation = (relationType, selectedRelation) => {
   if (selectedRelation === ALL_VALUE) return true;

   const filter = RELATION_FILTERS.find(item => item.value === selectedRelation);
   return filter?.relationTypes.includes(relationType) ?? relationType === selectedRelation;
};
