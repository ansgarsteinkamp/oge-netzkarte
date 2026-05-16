import { GeoJSON, Pane } from "react-leaflet";

import { cleanName, gasQualityLabel, pipelineStatusExceptionLabel, relationLabel } from "@/lib/domain/formatters";
import { pipelineStyle } from "@/lib/map/styles";

const createPipelineTooltip = item => {
   const title = document.createElement("strong");
   title.textContent = cleanName(item);
   return title;
};

export default function PipelineLayer({ layerKey, onSelectPipeline, pipelines, visible }) {
   const bindPipeline = (item, layer) => {
      const activate = () => onSelectPipeline(item);
      const props = item.properties;
      const status = pipelineStatusExceptionLabel(props.status);
      const label = [
         `Leitung ${cleanName(item)} auswählen`,
         props.name !== props.line_name ? `Abschnitt ${props.name}` : null,
         `ID ${props.id}`,
         relationLabel(props.oge_role),
         gasQualityLabel(props.gas_quality),
         status
      ]
         .filter(Boolean)
         .join(", ");
      let pipelineElement = null;
      const activateFromKeyboard = event => {
         if (event.key !== "Enter" && event.key !== " ") return;
         event.preventDefault();
         activate();
      };

      layer.bindTooltip(createPipelineTooltip(item), {
         className: "map-tooltip",
         direction: "top",
         offset: [0, -6],
         pane: "tooltipPane",
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
