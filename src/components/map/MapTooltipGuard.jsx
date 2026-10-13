import { useEffect } from "react";
import { useMap } from "react-leaflet";

const isHoveredOrFocused = element => !!element && (element.matches(":hover") || element === document.activeElement);

// Leaflet defers tooltips triggered while the map is dragged and opens them on moveend, even if the
// pointer has left the layer by then. Those tooltips never receive a mouseout and would stay open.
export default function MapTooltipGuard() {
   const map = useMap();

   useEffect(() => {
      const closeIfOrphaned = ({ tooltip }) => {
         window.setTimeout(() => {
            if (!map.hasLayer(tooltip)) return;
            if (!isHoveredOrFocused(tooltip._source?.getElement?.())) map.closeTooltip(tooltip);
         });
      };

      const closeAll = () => map.eachLayer(layer => layer.isTooltipOpen?.() && layer.closeTooltip());

      map.on("tooltipopen", closeIfOrphaned);
      map.on("mouseout", closeAll);

      return () => {
         map.off("tooltipopen", closeIfOrphaned);
         map.off("mouseout", closeAll);
      };
   }, [map]);

   return null;
}
