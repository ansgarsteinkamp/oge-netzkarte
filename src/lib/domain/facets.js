import { ALL_VALUE, GAS_QUALITY_LABELS, GAS_QUALITY_ORDER, POINT_CATEGORY_ORDER, RELATION_FILTERS } from "./constants.js";
import { pointCategoryLabel } from "./formatters.js";

const getUnique = (items, getter) => [...new Set(items.map(getter).filter(Boolean))].sort((a, b) => a.localeCompare(b, "de"));

const sortByOrder = (values, order) => {
   const orderMap = new Map(order.map((item, index) => [item, index]));
   return [...values].sort((a, b) => (orderMap.get(a) ?? 999) - (orderMap.get(b) ?? 999));
};

const withAllOption = options => [{ value: ALL_VALUE, label: "Alle" }, ...options];

export const buildFilterOptions = ({ points }) => {
   const pointCategories = sortByOrder(getUnique(points, point => point.category), POINT_CATEGORY_ORDER);

   return {
      relationTypes: withAllOption(RELATION_FILTERS.map(({ value, label, description }) => ({ value, label, description }))),
      pointCategories: withAllOption(pointCategories.map(category => ({ value: category, label: pointCategoryLabel(category) }))),
      gasTypes: GAS_QUALITY_ORDER.map(type => ({ value: type, label: GAS_QUALITY_LABELS[type] }))
   };
};
