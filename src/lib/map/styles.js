import { OGE_AFFILIATE_ROLES } from "../domain/constants.js";
import { PARTICIPATION_LINE_PATTERN, RELATION_COLORS, THEME } from "./theme.js";

const DASHED_ROLES = new Set(OGE_AFFILIATE_ROLES);

// CSS background that mimics the map line, used for legend and tooltip symbols.
export const getRelationSymbolBackground = role => {
   const color = RELATION_COLORS[role] ?? THEME.foreground;
   if (!DASHED_ROLES.has(role)) return color;

   const { dash, gap } = PARTICIPATION_LINE_PATTERN;
   return `repeating-linear-gradient(90deg, ${color} 0 ${dash}px, transparent ${dash}px ${dash + gap}px)`;
};

export const pipelineStyle = item => {
   const props = item.properties;
   return {
      color: RELATION_COLORS[props.oge_role] ?? THEME.foreground,
      weight: 4.2,
      opacity: 0.94,
      dashArray: DASHED_ROLES.has(props.oge_role) ? PARTICIPATION_LINE_PATTERN.dashArray : null,
      lineCap: "round",
      lineJoin: "round"
   };
};
