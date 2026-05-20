import { POINT_CATEGORY_COLORS, THEME } from "./theme.js";

// Render separate technical points once their centers are at least 10% of one marker diameter apart.
const TECHNICAL_POINT_OVERLAP_FACTOR = 0.1;

export const getPointRadius = importanceLevel => {
   const numericLevel = Number(importanceLevel);
   const level = Math.min(5, Math.max(1, Number.isFinite(numericLevel) ? numericLevel : 3));
   return 6.4 + (level - 1) * 0.8;
};

export const getPointColor = category => POINT_CATEGORY_COLORS[category] ?? THEME.primary;

export const getPointPathOptions = ({ category }, fillOpacity = 0.95) => ({
   color: THEME.background,
   fillColor: getPointColor(category),
   fillOpacity,
   opacity: 1,
   weight: 2
});

const getDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

export const getMinimumTechnicalPointDistance = (cluster, map) => {
   const projected = (cluster.points ?? []).map(point => map.latLngToLayerPoint([point.lat, point.lon]));
   let minDistance = Infinity;

   for (let i = 0; i < projected.length; i += 1) {
      for (let j = i + 1; j < projected.length; j += 1) {
         minDistance = Math.min(minDistance, getDistance(projected[i], projected[j]));
      }
   }

   return Number.isFinite(minDistance) ? minDistance : 0;
};

export const shouldRenderTechnicalPoints = (cluster, map) => {
   if ((cluster.points ?? []).length <= 1) return false;

   const requiredDistance = getPointRadius(cluster.importance_level) * 2 * TECHNICAL_POINT_OVERLAP_FACTOR;
   return getMinimumTechnicalPointDistance(cluster, map) >= requiredDistance;
};
