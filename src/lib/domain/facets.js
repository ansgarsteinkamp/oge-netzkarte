import { ALL_VALUE, GAS_TYPE_ORDER, MAIN_DIRECTION_ORDER, POINT_TYPE_ORDER, RELATION_FILTERS } from "./constants.js";
import { getPipelineGasFilterValue } from "./filters.js";
import { mainDirectionLabel, pointTypeLabel } from "./formatters.js";

export const getUnique = (items, getter) => [...new Set(items.map(getter).filter(Boolean))].sort((a, b) => a.localeCompare(b, "de"));

export const getUniqueWithNull = (items, getter) =>
   [...new Set(items.map(getter).filter(value => value !== undefined && value !== ""))].sort((a, b) => String(a).localeCompare(String(b), "de"));

export const sortByOrder = (values, order) => {
   const orderMap = new Map(order.map((item, index) => [item, index]));
   return [...values].sort((a, b) => (orderMap.get(a) ?? 999) - (orderMap.get(b) ?? 999));
};

export const buildFilterOptions = ({ pipelineCollection, points }) => {
   const pointTypes = sortByOrder(getUnique(points, point => point.point_type), POINT_TYPE_ORDER);
   const gasTypes = sortByOrder(getUnique([...points, ...pipelineCollection.features], item => item.gas_type ?? getPipelineGasFilterValue(item.properties?.gas_quality)), GAS_TYPE_ORDER);
   const mainDirectionTypes = sortByOrder(getUniqueWithNull(points, point => point.direction), MAIN_DIRECTION_ORDER);

   return {
      relationTypes: [{ value: ALL_VALUE, label: "Alle" }, ...RELATION_FILTERS.map(({ value, label }) => ({ value, label }))],
      pointTypes: [{ value: ALL_VALUE, label: "Alle" }, ...pointTypes.map(type => ({ value: type, label: pointTypeLabel(type) }))],
      gasTypes: [{ value: ALL_VALUE, label: "Alle" }, ...gasTypes.map(type => ({ value: type, label: type }))],
      mainDirectionTypes: [{ value: ALL_VALUE, label: "Alle" }, ...mainDirectionTypes.map(type => ({ value: type, label: mainDirectionLabel(type) }))]
   };
};
