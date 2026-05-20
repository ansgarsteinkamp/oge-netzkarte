export const toLatLng = item => [item.lat, item.lon];

export const geoJsonPositionToLatLng = ([lon, lat]) => [lat, lon];

export const lineStringToLatLngs = feature => feature.geometry.coordinates.map(geoJsonPositionToLatLng);

export const getTechnicalPointLatLngs = point => (point.points ?? []).map(toLatLng);

export const getPointBoundsLatLngs = point => {
   const technicalPointLatLngs = getTechnicalPointLatLngs(point);
   return technicalPointLatLngs.length > 0 ? technicalPointLatLngs : [toLatLng(point)];
};

export const hasDistinctLatLngs = latLngs => {
   const [first] = latLngs;
   if (!first) return false;

   return latLngs.some(([lat, lon]) => lat !== first[0] || lon !== first[1]);
};
