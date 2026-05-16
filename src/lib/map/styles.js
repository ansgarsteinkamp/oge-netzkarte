import { OGE_AFFILIATE_ROLES } from "../domain/constants.js";
import { PARTICIPATION_LINE_PATTERN, RELATION_COLORS, THEME } from "./theme.js";

const DASHED_ROLES = new Set(OGE_AFFILIATE_ROLES);

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
