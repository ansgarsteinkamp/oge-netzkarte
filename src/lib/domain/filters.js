import { ALL_VALUE, RELATION_FILTERS } from "./constants.js";

const PIPELINE_GAS_FILTER_VALUES = {
   "H-Gas": "H-Gas",
   "unbekannt / L-Gas-nahe Rohdatenkodierung": "L-Gas"
};

const getPipelineGasFilterValue = value => PIPELINE_GAS_FILTER_VALUES[value] ?? value;

export const matchesPipelineGas = (gasQuality, selectedGasType) => selectedGasType === ALL_VALUE || getPipelineGasFilterValue(gasQuality) === selectedGasType;

export const matchesPipelineRelation = (relationType, selectedRelation) => {
   if (selectedRelation === ALL_VALUE) return true;

   const filter = RELATION_FILTERS.find(item => item.value === selectedRelation);
   return filter?.relationTypes.includes(relationType) ?? relationType === selectedRelation;
};
