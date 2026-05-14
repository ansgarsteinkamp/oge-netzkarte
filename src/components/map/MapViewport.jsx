import { MapContainer } from "react-leaflet";

export default function MapViewport({ children }) {
   return (
      <section className="relative h-full min-h-[620px] overflow-hidden border border-border bg-muted/75 max-lg:order-1 max-lg:h-auto max-lg:min-h-[58vh] max-sm:min-h-[54vh]">
         <MapContainer
            aria-label="Interaktive Karte mit Leitungen, Punkten und europäischen Kontextländern"
            className="h-full min-h-[620px] bg-map-background max-lg:min-h-[58vh] max-sm:min-h-[54vh]"
            center={[51.1, 10.3]}
            role="region"
            zoom={6}
            minZoom={5}
            maxZoom={10}
            scrollWheelZoom
            zoomControl={false}
            attributionControl={false}
         >
            {children}
         </MapContainer>
      </section>
   );
}
