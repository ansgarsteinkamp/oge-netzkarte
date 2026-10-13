import { GeoJSON, Pane, useMap } from "react-leaflet";

import { getPipelineDetailRows } from "@/lib/domain/details";
import { cleanName } from "@/lib/domain/formatters";
import { getRelationSymbolBackground, pipelineStyle } from "@/lib/map/styles";
import { createMapTooltip, getTooltipPlacement } from "@/lib/map/tooltip";

const createPipelineTooltip = item => createMapTooltip({
   title: cleanName(item),
   rows: getPipelineDetailRows(item),
   symbol: { kind: "line", background: getRelationSymbolBackground(item.properties.oge_role) }
});

export default function PipelineLayer({ layerKey, onSelectPipeline, pipelines, visible }) {
   const map = useMap();

   const bindPipeline = (item, layer) => {
      const activate = () => onSelectPipeline(item);

      layer.bindTooltip(createPipelineTooltip(item), {
         className: "map-tooltip",
         opacity: 1,
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
         mouseover: event => {
            const tooltip = layer.getTooltip();
            Object.assign(tooltip.options, getTooltipPlacement(event.containerPoint.y, map.getSize().y));
            if (layer.isTooltipOpen()) tooltip.update();
            event.target.setStyle({ weight: 6, opacity: 1 });
         },
         mouseout: event => event.target.setStyle(pipelineStyle(item))
      });
   };

   return <Pane name="pipelines" style={{ zIndex: 420 }}>{visible && <GeoJSON key={layerKey} data={pipelines} style={pipelineStyle} onEachFeature={bindPipeline} />}</Pane>;
}
