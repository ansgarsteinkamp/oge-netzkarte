import { GeoJSON, Pane } from "react-leaflet";

import { cleanName } from "@/lib/domain/formatters";
import { pipelineStyle } from "@/lib/map/styles";

const createPipelineTooltip = item => {
   const title = document.createElement("strong");
   title.textContent = cleanName(item);
   return title;
};

export default function PipelineLayer({ layerKey, onSelectPipeline, pipelines, visible }) {
   const bindPipeline = (item, layer) => {
      const activate = () => onSelectPipeline(item);

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
               element.setAttribute("aria-hidden", "true");
               element.setAttribute("tabindex", "-1");
            }
         },
         click: activate,
         mouseover: event => event.target.setStyle({ weight: 6, opacity: 1 }),
         mouseout: event => event.target.setStyle(pipelineStyle(item))
      });
   };

   return <Pane name="pipelines" style={{ zIndex: 420 }}>{visible && <GeoJSON key={layerKey} data={pipelines} style={pipelineStyle} onEachFeature={bindPipeline} />}</Pane>;
}
