import { CircleMarker, Pane, Tooltip } from "react-leaflet";

import { mainDirectionLabel, pointTypeLabel } from "@/lib/domain/formatters";
import { POINT_COLORS, THEME } from "@/lib/map/theme";

function PointMarker({ onSelectPoint, point, pointOffsets }) {
   const center = pointOffsets.get(point.id);
   const isOffset = center?.[0] !== point.latitude || center?.[1] !== point.longitude;
   const activate = () => onSelectPoint(point, isOffset);
   let markerElement = null;
   const activateFromKeyboard = event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      activate();
   };

   return (
      <CircleMarker
         center={center}
         radius={8}
         pathOptions={{
            color: THEME.background,
            fillColor: POINT_COLORS[point.point_type] ?? THEME.primary,
            fillOpacity: 0.95,
            opacity: 1,
            weight: 2
         }}
         eventHandlers={{
            add: event => {
               const element = event.target.getElement();
               if (element) {
                  markerElement = element;
                  element.setAttribute("aria-label", `Punkt ${point.name} auswählen`);
                  element.setAttribute("role", "button");
                  element.setAttribute("tabindex", "0");
                  element.addEventListener("keydown", activateFromKeyboard);
               }
            },
            click: activate,
            remove: () => {
               if (markerElement) markerElement.removeEventListener("keydown", activateFromKeyboard);
               markerElement = null;
            }
         }}
      >
         <Tooltip className="map-tooltip" direction="top" offset={[0, -6]}>
            <strong>{point.name}</strong>
            <span>{pointTypeLabel(point.point_type)}</span>
            <span>Hauptrichtung: {mainDirectionLabel(point.direction)}</span>
            <span>Gasart: {point.gas_type}</span>
         </Tooltip>
      </CircleMarker>
   );
}

export default function PointLayer({ onSelectPoint, pointOffsets, points, visible }) {
   return (
      <Pane name="points" style={{ zIndex: 460 }}>
         {visible &&
            points.map(point => <PointMarker key={point.id} point={point} pointOffsets={pointOffsets} onSelectPoint={onSelectPoint} />)}
      </Pane>
   );
}
