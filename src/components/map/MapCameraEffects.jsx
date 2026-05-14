import { useEffect } from "react";
import { useMap } from "react-leaflet";

import { INITIAL_BOUNDS } from "@/lib/map/bounds";

function FitBounds({ resetKey }) {
   const map = useMap();

   useEffect(() => {
      map.fitBounds(INITIAL_BOUNDS, { padding: [24, 24] });
   }, [map, resetKey]);

   return null;
}

function FitSearchResults({ bounds }) {
   const map = useMap();

   useEffect(() => {
      if (!bounds.length) return;

      if (bounds.length === 1) {
         map.setView(bounds[0], Math.max(map.getZoom(), 8), { animate: true });
      } else {
         map.fitBounds(bounds, { animate: true, maxZoom: 8, padding: [48, 48] });
      }
   }, [bounds, map]);

   return null;
}

function FitSelection({ pointOffsets, selection }) {
   const map = useMap();

   useEffect(() => {
      if (!selection) return;

      if (selection.kind === "point") {
         const center = pointOffsets.get(selection.item.id) ?? [selection.item.latitude, selection.item.longitude];
         map.setView(center, Math.max(map.getZoom(), 8), { animate: true });
      } else {
         map.fitBounds(selection.item.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude]), { animate: true, maxZoom: 8, padding: [48, 48] });
      }
   }, [map, pointOffsets, selection]);

   return null;
}

export default function MapCameraEffects({ pointOffsets, resetViewKey, searchBounds, selection }) {
   return (
      <>
         <FitBounds resetKey={resetViewKey} />
         <FitSearchResults bounds={searchBounds} />
         <FitSelection pointOffsets={pointOffsets} selection={selection} />
      </>
   );
}
