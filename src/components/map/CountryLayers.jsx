import { GeoJSON, Pane } from "react-leaflet";

import { THEME } from "@/lib/map/theme";

export default function CountryLayers({ europeContext, germany }) {
   return (
      <Pane name="countries" style={{ zIndex: 300 }}>
         <GeoJSON data={europeContext} style={{ color: "#74746a", weight: 1.1, fillColor: "#30302e", fillOpacity: 0.84 }} />
         <GeoJSON data={germany} style={{ color: THEME.secondary, weight: 2.1, fillColor: "#22221f", fillOpacity: 0.9 }} />
      </Pane>
   );
}
