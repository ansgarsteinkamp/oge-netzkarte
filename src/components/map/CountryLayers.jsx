import { GeoJSON, Pane } from "react-leaflet";

import { COUNTRY_STYLES } from "@/lib/map/theme";

export default function CountryLayers({ europeContext, germany }) {
   return (
      <Pane name="countries" style={{ zIndex: 300 }}>
         <GeoJSON data={europeContext} style={COUNTRY_STYLES.context} />
         <GeoJSON data={germany} style={COUNTRY_STYLES.germany} />
      </Pane>
   );
}
