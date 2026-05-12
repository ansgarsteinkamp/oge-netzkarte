import { GeoJSON, Pane } from "react-leaflet";

import { RELATION_LABELS } from "@/lib/domain/constants";
import { cleanName } from "@/lib/domain/formatters";
import { pipelineStyle } from "@/lib/map/styles";

const createPipelineTooltip = item => {
   const props = item.properties;
   const container = document.createElement("div");
   const title = document.createElement("strong");
   const relation = document.createElement("span");
   const operator = document.createElement("span");

   title.textContent = cleanName(item);
   relation.textContent = RELATION_LABELS[props.relation_type] ?? props.relation_type ?? "Beziehung unbekannt";
   operator.textContent = props.operator ?? "Operator unbekannt";

   container.append(title, relation, operator);
   return container;
};

export default function PipelineLayer({ layerKey, onSelectPipeline, pipelines, visible }) {
   const bindPipeline = (item, layer) => {
      const activate = () => onSelectPipeline(item);
      const label = `Leitung ${cleanName(item)} auswählen`;
      let pipelineElement = null;
      const activateFromKeyboard = event => {
         if (event.key !== "Enter" && event.key !== " ") return;
         event.preventDefault();
         activate();
      };

      layer.bindTooltip(createPipelineTooltip(item), {
         className: "map-tooltip",
         direction: "top",
         sticky: true
      });
      layer.on({
         add: () => {
            const element = layer.getElement();
            if (element) {
               pipelineElement = element;
               element.setAttribute("aria-label", label);
               element.setAttribute("role", "button");
               element.setAttribute("tabindex", "0");
               element.addEventListener("keydown", activateFromKeyboard);
            }
         },
         click: activate,
         mouseover: event => event.target.setStyle({ weight: 6, opacity: 1 }),
         mouseout: event => event.target.setStyle(pipelineStyle(item)),
         remove: () => {
            if (pipelineElement) pipelineElement.removeEventListener("keydown", activateFromKeyboard);
            pipelineElement = null;
         }
      });
   };

   return <Pane name="pipelines" style={{ zIndex: 420 }}>{visible && <GeoJSON key={layerKey} data={pipelines} style={pipelineStyle} onEachFeature={bindPipeline} />}</Pane>;
}
