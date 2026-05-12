import { RELATION_COLORS, THEME } from "./theme.js";

export const pipelineStyle = item => {
   const props = item.properties;
   const isRoute = Boolean(props.route_group);
   return {
      color: RELATION_COLORS[props.relation_type] ?? THEME.foreground,
      weight: isRoute ? 4.2 : 2.6,
      opacity: isRoute ? 0.94 : 0.66,
      dashArray: props.relation_type === "joint_venture" || props.relation_type === "oge_owned_affiliate" ? "7 5" : null,
      lineCap: "round",
      lineJoin: "round"
   };
};
