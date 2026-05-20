import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

export default function MapZoomControls() {
   const map = useMap();
   const [zoom, setZoom] = useState(map.getZoom());

   useEffect(() => {
      const syncZoom = () => setZoom(map.getZoom());
      map.on("zoomend", syncZoom);
      syncZoom();

      return () => {
         map.off("zoomend", syncZoom);
      };
   }, [map]);

   return (
      <div className="absolute top-3 left-3 z-[500] grid border border-border bg-accent" role="group" aria-label="Kartenzoom">
         <button
            aria-label="Karte vergrößern"
            className="grid size-8 place-items-center border-0 border-b border-border bg-accent text-base leading-none font-medium text-accent-foreground transition-colors hover:bg-primary/20 hover:text-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={zoom >= map.getMaxZoom()}
            onClick={() => map.zoomIn()}
            type="button"
         >
            <Plus aria-hidden="true" className="size-4" />
         </button>
         <button
            aria-label="Karte verkleinern"
            className="grid size-8 place-items-center border-0 bg-accent text-base leading-none font-medium text-accent-foreground transition-colors hover:bg-primary/20 hover:text-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={zoom <= map.getMinZoom()}
            onClick={() => map.zoomOut()}
            type="button"
         >
            <Minus aria-hidden="true" className="size-4" />
         </button>
      </div>
   );
}
