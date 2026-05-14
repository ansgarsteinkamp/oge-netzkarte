import { OGE_PARTICIPATION_RELATION_TYPES } from "../domain/constants.js";
import { PARTICIPATION_LINE_PATTERN, RELATION_COLORS, THEME } from "./theme.js";

const DASHED_RELATION_TYPES = new Set(OGE_PARTICIPATION_RELATION_TYPES);

export const pipelineStyle = item => {
   const props = item.properties;
   return {
      color: RELATION_COLORS[props.relation_type] ?? THEME.foreground,
      weight: 4.2,
      opacity: 0.94,
      dashArray: DASHED_RELATION_TYPES.has(props.relation_type) ? PARTICIPATION_LINE_PATTERN.dashArray : null,
      lineCap: "round",
      lineJoin: "round"
   };
};
