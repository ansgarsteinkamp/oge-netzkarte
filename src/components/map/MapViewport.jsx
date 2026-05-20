import { useEffect } from "react";
import { MapContainer, useMap } from "react-leaflet";

const MAP_LABEL = "Interaktive Karte mit Leitungen, Punkten und europäischen Kontextländern";

function MapContainerA11yAttributes() {
   const map = useMap();

   useEffect(() => {
      const container = map.getContainer();
      container.setAttribute("aria-label", MAP_LABEL);
      container.setAttribute("role", "application");
   }, [map]);

   return null;
}

export default function MapViewport({ children }) {
   return (
      <section
         aria-label={MAP_LABEL}
         className="relative h-full min-h-[620px] overflow-hidden border border-border bg-muted/75 max-xl:h-auto max-lg:order-1 max-lg:min-h-[58vh] max-sm:min-h-[54vh]"
         role="region"
      >
         <MapContainer
            className="h-full min-h-[620px] bg-map-background max-xl:h-auto max-lg:min-h-[58vh] max-sm:min-h-[54vh]"
            center={[51.1, 10.3]}
            zoom={6}
            minZoom={5}
            maxZoom={10}
            scrollWheelZoom
            zoomControl={false}
            attributionControl={false}
         >
            <MapContainerA11yAttributes />
            {children}
         </MapContainer>
      </section>
   );
}
