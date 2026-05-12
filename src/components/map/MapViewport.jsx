import { MapContainer } from "react-leaflet";

export default function MapViewport({ children }) {
   return (
      <section className="relative h-full min-h-[620px] overflow-hidden border border-border bg-muted/75 max-[840px]:order-1 max-[840px]:h-auto max-[840px]:min-h-[58vh] max-[560px]:min-h-[54vh]">
         <MapContainer
            aria-label="Interaktive Karte mit Leitungen, Punkten und europäischen Kontextländern"
            className="h-full min-h-[620px] bg-[#20201d] max-[840px]:min-h-[58vh] max-[560px]:min-h-[54vh]"
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
