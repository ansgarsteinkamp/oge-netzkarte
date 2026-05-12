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

function FitSearchResults({ bounds, query }) {
   const map = useMap();

   useEffect(() => {
      if (query.length < 2 || !bounds.length) return;

      if (bounds.length === 1) {
         map.setView(bounds[0], Math.max(map.getZoom(), 8), { animate: true });
      } else {
         map.fitBounds(bounds, { animate: true, maxZoom: 8, padding: [48, 48] });
      }
   }, [bounds, map, query]);

   return null;
}

function FitSelection({ pointOffsets, selection }) {
   const map = useMap();

   useEffect(() => {
      if (!selection) return;

      if (selection.kind === "point") {
         map.setView(pointOffsets.get(selection.item.id), Math.max(map.getZoom(), 8), { animate: true });
      } else {
         map.fitBounds(selection.item.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude]), { animate: true, maxZoom: 8, padding: [48, 48] });
      }
   }, [map, pointOffsets, selection]);

   return null;
}

export default function MapCameraEffects({ pointOffsets, query, resetViewKey, searchBounds, selection }) {
   return (
      <>
         <FitBounds resetKey={resetViewKey} />
         <FitSearchResults bounds={searchBounds} query={query} />
         <FitSelection pointOffsets={pointOffsets} selection={selection} />
      </>
   );
}
