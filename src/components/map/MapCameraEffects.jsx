import { useEffect } from "react";
import { useMap } from "react-leaflet";

import { lineStringToLatLngs, toLatLng } from "@/lib/domain/coordinates";
import { INITIAL_BOUNDS } from "@/lib/map/bounds";

const CAMERA_PADDING = [48, 48];
const SEARCH_MAX_ZOOM = 8;
const POINT_MAX_ZOOM = 10;

function FitBounds({ resetKey }) {
   const map = useMap();

   useEffect(() => {
      map.fitBounds(INITIAL_BOUNDS, { padding: [24, 24] });
   }, [map, resetKey]);

   return null;
}

function FitSearchResults({ bounds, disabled }) {
   const map = useMap();

   useEffect(() => {
      if (disabled) return;
      if (!bounds.length) return;

      if (bounds.length === 1) {
         map.setView(bounds[0], SEARCH_MAX_ZOOM, { animate: true });
      } else {
         map.fitBounds(bounds, { animate: true, maxZoom: SEARCH_MAX_ZOOM, padding: CAMERA_PADDING });
      }
   }, [bounds, disabled, map]);

   return null;
}

function FitSelection({ selection }) {
   const map = useMap();

   useEffect(() => {
      if (!selection) return;

      if (selection.kind === "point") {
         if (selection.technicalPoint) {
            map.setView(toLatLng(selection.technicalPoint), Math.max(map.getZoom(), POINT_MAX_ZOOM), { animate: false });
            return;
         }

         map.setView(toLatLng(selection.item), Math.max(map.getZoom(), POINT_MAX_ZOOM), { animate: false });
      } else {
         map.fitBounds(lineStringToLatLngs(selection.item), { animate: true, maxZoom: SEARCH_MAX_ZOOM, padding: CAMERA_PADDING });
      }
   }, [map, selection]);

   return null;
}

export default function MapCameraEffects({ resetViewKey, searchBounds, selection }) {
   return (
      <>
         <FitBounds resetKey={resetViewKey} />
         <FitSearchResults bounds={searchBounds} disabled={!!selection} />
         <FitSelection selection={selection} />
      </>
   );
}
