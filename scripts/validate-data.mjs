import { readFile } from "node:fs/promises";

import {
   GERMANY_ID,
   RELATION_FILTERS,
   RELATION_LABELS,
   VALID_PIPELINE_GAS_QUALITIES,
   VALID_PIPELINE_STATUSES,
   VALID_POINT_CATEGORIES,
   VALID_POINT_GAS_QUALITIES
} from "../src/lib/domain/constants.js";

const files = {
   points: "public/data/punkte_v2.json",
   pipelines: "public/data/leitungen_v2.geojson",
   countries: "public/data/countries_v2.geojson"
};

const requiredPointFields = ["id", "name", "category", "gas_quality", "importance_level", "lat", "lon", "position_method", "description", "points"];
const requiredTechnicalPointFields = ["location_id", "label", "eic", "lat", "lon"];
const validPositionMethods = new Set(["single", "mean"]);
const COORDINATE_TOLERANCE_METERS = 25;
const EARTH_RADIUS_METERS = 6371000;
const MAX_TECHNICAL_POINT_DISTANCE_METERS = 5000;
const validPipelineRelationTypes = new Set(Object.keys(RELATION_LABELS));
const filterRelationTypes = RELATION_FILTERS.flatMap(filter => filter.relationTypes);
const validFilterRelationTypes = new Set(filterRelationTypes);
const requiredPipelineFields = ["id", "name", "operator", "gas_quality", "status", "oge_role", "source", "system_id", "line_name"];
const mojibakePattern = /[\u00C3\u00C2\uFFFD]/;

Object.keys(RELATION_LABELS).forEach(type => assert(validFilterRelationTypes.has(type), `Relation ${type}: fehlt in RELATION_FILTERS`));
filterRelationTypes.forEach(type => assert(validPipelineRelationTypes.has(type), `RELATION_FILTERS enthaelt unbekannte Relation ${type}`));
assert(filterRelationTypes.length === validFilterRelationTypes.size, "RELATION_FILTERS enthaelt doppelte Relationstypen");

async function readJson(path) {
   const text = await readFile(path, "utf8");

   if (text.charCodeAt(0) === 0xfeff) {
      throw new Error(`${path}: BOM am Dateianfang gefunden`);
   }

   if (mojibakePattern.test(text)) {
      throw new Error(`${path}: möglicher Encoding-/Mojibake-Fehler gefunden`);
   }

   return JSON.parse(text);
}

function assert(condition, message) {
   if (!condition) throw new Error(message);
}

function assertNonEmptyString(value, message) {
   assert(typeof value === "string" && value.trim() !== "", message);
}

function assertTrimmedNonEmptyString(value, message) {
   assertNonEmptyString(value, message);
   assert(value === value.trim(), `${message}: darf keine führenden oder nachgestellten Leerzeichen enthalten`);
}

function assertFiniteNumber(value, message) {
   assert(Number.isFinite(value), message);
}

function assertOptionalNonEmptyString(value, message) {
   assert(value === null || value === undefined || (typeof value === "string" && value.trim() !== ""), message);
}

function assertOptionalTrimmedNonEmptyString(value, message) {
   assertOptionalNonEmptyString(value, message);
   assert(value === null || value === undefined || value === value.trim(), `${message}: darf keine führenden oder nachgestellten Leerzeichen enthalten`);
}

function assertUniqueIds(items, getter, label) {
   const ids = items.map(getter).filter(Boolean).map(value => String(value).trim());
   const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
   assert(duplicates.length === 0, `${label}: doppelte IDs gefunden: ${[...new Set(duplicates)].join(", ")}`);
}

function assertLatLon({ lat, lon }, label) {
   assertFiniteNumber(lat, `${label}: lat ist ungültig`);
   assertFiniteNumber(lon, `${label}: lon ist ungültig`);
   assert(lat >= 45 && lat <= 56 && lon >= 3 && lon <= 17, `${label}: Koordinaten liegen außerhalb des erwarteten Kartenraums`);
}

function approximateDistanceMeters(a, b) {
   const toRadians = degrees => degrees * Math.PI / 180;
   const lat1 = toRadians(a.lat);
   const lat2 = toRadians(b.lat);
   const deltaLat = toRadians(b.lat - a.lat);
   const deltaLon = toRadians(b.lon - a.lon);
   const haversine =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

   return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function averageLatLon(points) {
   return {
      lat: points.reduce((sum, point) => sum + point.lat, 0) / points.length,
      lon: points.reduce((sum, point) => sum + point.lon, 0) / points.length
   };
}

function validatePointPositionMethod(point) {
   const clusterCoordinate = { lat: point.lat, lon: point.lon };
   const centroid = averageLatLon(point.points);
   const centroidDistance = approximateDistanceMeters(clusterCoordinate, centroid);

   point.points.forEach((technicalPoint, index) => {
      const distance = approximateDistanceMeters(clusterCoordinate, technicalPoint);
      assert(distance <= MAX_TECHNICAL_POINT_DISTANCE_METERS, `Punkt ${point.id}: technischer Punkt ${index + 1} liegt zu weit vom Cluster entfernt`);
   });

   if (point.position_method === "single") {
      point.points.forEach((technicalPoint, index) => {
         const distance = approximateDistanceMeters(clusterCoordinate, technicalPoint);
         assert(distance <= COORDINATE_TOLERANCE_METERS, `Punkt ${point.id}: position_method single passt nicht zur Koordinate von technischem Punkt ${index + 1}`);
      });
      assert(centroidDistance <= COORDINATE_TOLERANCE_METERS, `Punkt ${point.id}: position_method single passt nicht zur Cluster-Koordinate`);
      return;
   }

   assert(point.points.length > 1, `Punkt ${point.id}: position_method mean erwartet mehrere technische Punkte`);
   assert(centroidDistance <= COORDINATE_TOLERANCE_METERS, `Punkt ${point.id}: position_method mean passt nicht zum Mittelpunkt der technischen Punkte`);
}

function assertCoordinatePair(value, message) {
   assert(Array.isArray(value) && value.length >= 2, `${message}: Koordinate muss [Longitude, Latitude] sein`);
   const [longitude, latitude] = value;
   assertFiniteNumber(latitude, `${message}: ungültige Latitude`);
   assertFiniteNumber(longitude, `${message}: ungültige Longitude`);
   return { longitude, latitude };
}

function hasDistinctCoordinatePair(coordinates, label) {
   const first = assertCoordinatePair(coordinates[0], `${label}: erste Koordinate`);
   return coordinates.some((coordinate, index) => {
      const { longitude, latitude } = assertCoordinatePair(coordinate, `${label}: Koordinate ${index + 1}`);
      return longitude !== first.longitude || latitude !== first.latitude;
   });
}

function validatePoints(points) {
   assert(Array.isArray(points), "punkte_v2.json muss ein Array sein");
   assert(points.length > 0, "punkte_v2.json enthält keine Punkte");
   assertUniqueIds(points, point => point.id, "Punkt-Cluster");

   const technicalPoints = points.flatMap(point => point.points ?? []);
   assertUniqueIds(technicalPoints, point => point.location_id, "Technische Punkte location_id");
   assertUniqueIds(technicalPoints, point => point.eic, "Technische Punkte eic");

   points.forEach(point => {
      requiredPointFields.forEach(field => assert(point[field] !== undefined && point[field] !== null && point[field] !== "", `Punkt ${point.id ?? "ohne ID"}: Feld ${field} fehlt`));
      assertTrimmedNonEmptyString(point.id, `Punkt ${point.id ?? "ohne ID"}: id muss ein Text sein`);
      assertTrimmedNonEmptyString(point.name, `Punkt ${point.id}: name muss ein Text sein`);
      assert(VALID_POINT_CATEGORIES.has(point.category), `Punkt ${point.id}: category ist ungültig`);
      assert(VALID_POINT_GAS_QUALITIES.has(point.gas_quality), `Punkt ${point.id}: gas_quality ist ungültig`);
      assert(Number.isInteger(point.importance_level) && point.importance_level >= 1 && point.importance_level <= 5, `Punkt ${point.id}: importance_level muss 1 bis 5 sein`);
      assert(validPositionMethods.has(point.position_method), `Punkt ${point.id}: position_method ist ungültig`);
      assertOptionalTrimmedNonEmptyString(point.adjacent_country, `Punkt ${point.id}: adjacent_country ist ungültig`);
      assertOptionalTrimmedNonEmptyString(point.vip_name, `Punkt ${point.id}: vip_name ist ungültig`);
      assertOptionalTrimmedNonEmptyString(point.zone, `Punkt ${point.id}: zone ist ungültig`);
      assertTrimmedNonEmptyString(point.description, `Punkt ${point.id}: description muss ein Text sein`);
      assertLatLon(point, `Punkt ${point.id}`);
      assert(Array.isArray(point.points) && point.points.length > 0, `Punkt ${point.id}: points muss technische Einzelpunkte enthalten`);

      point.points.forEach((technicalPoint, index) => {
         const label = `Punkt ${point.id}: technischer Punkt ${index + 1}`;
         requiredTechnicalPointFields.forEach(field => assert(technicalPoint[field] !== undefined && technicalPoint[field] !== null && technicalPoint[field] !== "", `${label}: Feld ${field} fehlt`));
         assertTrimmedNonEmptyString(technicalPoint.location_id, `${label}: location_id muss ein Text sein`);
         assertTrimmedNonEmptyString(technicalPoint.label, `${label}: label muss ein Text sein`);
         assertTrimmedNonEmptyString(technicalPoint.eic, `${label}: eic muss ein Text sein`);
         assertLatLon(technicalPoint, label);
      });

      validatePointPositionMethod(point);
   });
}

function validateFeatureCollection(collection, label) {
   assert(collection?.type === "FeatureCollection", `${label}: muss eine GeoJSON FeatureCollection sein`);
   assert(Array.isArray(collection.features) && collection.features.length > 0, `${label}: enthält keine Features`);
}

function validatePipelines(collection) {
   validateFeatureCollection(collection, "Leitungen");
   assertUniqueIds(collection.features, feature => feature.properties?.id, "Leitungen");

   collection.features.forEach(feature => {
      assert(feature.type === "Feature", `Leitung ${feature.properties?.id ?? "ohne ID"}: type muss Feature sein`);
      assert(feature.geometry?.type === "LineString", `Leitung ${feature.properties?.id ?? "ohne ID"}: nur LineString wird unterstützt`);
      assert(Array.isArray(feature.geometry.coordinates) && feature.geometry.coordinates.length >= 2, `Leitung ${feature.properties?.id}: Geometrie ist zu kurz`);
      assert(hasDistinctCoordinatePair(feature.geometry.coordinates, `Leitung ${feature.properties?.id}`), `Leitung ${feature.properties?.id}: Geometrie hat keine Laenge`);
      requiredPipelineFields.forEach(field => assert(feature.properties?.[field] !== undefined && feature.properties?.[field] !== null && feature.properties?.[field] !== "", `Leitung ${feature.properties?.id ?? "ohne ID"}: Feld ${field} fehlt`));
      assertTrimmedNonEmptyString(feature.properties.id, `Leitung ${feature.properties?.id ?? "ohne ID"}: id muss ein Text sein`);
      assert(feature.id === feature.properties.id, `Leitung ${feature.properties.id}: feature.id und properties.id müssen identisch sein`);
      assertTrimmedNonEmptyString(feature.properties.name, `Leitung ${feature.properties.id}: name muss ein Text sein`);
      assertTrimmedNonEmptyString(feature.properties.line_name, `Leitung ${feature.properties.id}: line_name muss ein Text sein`);
      assertTrimmedNonEmptyString(feature.properties.system_id, `Leitung ${feature.properties.id}: system_id muss ein Text sein`);
      assertTrimmedNonEmptyString(feature.properties.operator, `Leitung ${feature.properties.id}: operator muss ein Text sein`);
      assert(validPipelineRelationTypes.has(feature.properties.oge_role), `Leitung ${feature.properties.id}: oge_role ist ungültig`);
      assert(VALID_PIPELINE_GAS_QUALITIES.has(feature.properties.gas_quality), `Leitung ${feature.properties.id}: gas_quality ist ungültig`);
      assert(VALID_PIPELINE_STATUSES.has(feature.properties.status), `Leitung ${feature.properties.id}: status ist ungültig`);
      assertTrimmedNonEmptyString(feature.properties.source, `Leitung ${feature.properties.id}: source muss ein Text sein`);
      feature.geometry.coordinates.forEach((coordinate, index) => {
         const { longitude, latitude } = assertCoordinatePair(coordinate, `Leitung ${feature.properties.id}: Koordinate ${index + 1}`);
         assert(latitude >= 45 && latitude <= 56 && longitude >= 3 && longitude <= 17, `Leitung ${feature.properties.id}: Koordinaten liegen ausserhalb des erwarteten Kartenraums`);
      });
   });
}

function validateCountries(collection) {
   validateFeatureCollection(collection, "Laender");
   assertUniqueIds(collection.features, feature => String(feature.id).padStart(3, "0"), "Laender");

   const germanyFeatures = collection.features.filter(feature => String(feature.id).padStart(3, "0") === GERMANY_ID);
   assert(germanyFeatures.length === 1, `Laender: Deutschland muss genau einmal vorkommen, gefunden: ${germanyFeatures.length}`);

   collection.features.forEach(feature => {
      const id = String(feature.id ?? "");
      assert(feature.type === "Feature", `Land ${id}: type muss Feature sein`);
      assertNonEmptyString(id, "Land ohne ID gefunden");
      assert(/^\d{3}$/.test(id), `Land ${id}: ID muss dreistellig numerisch sein`);
      assertNonEmptyString(feature.properties?.name, `Land ${id}: name fehlt`);
      assert(["Polygon", "MultiPolygon"].includes(feature.geometry?.type), `Land ${id}: nur Polygon/MultiPolygon wird unterstuetzt`);

      const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
      assert(Array.isArray(polygons) && polygons.length > 0, `Land ${id}: Geometrie enthaelt keine Polygone`);

      polygons.forEach((polygon, polygonIndex) => {
         assert(Array.isArray(polygon) && polygon.length > 0, `Land ${id}: Polygon ${polygonIndex} enthaelt keine Ringe`);

         polygon.forEach((ring, ringIndex) => {
            assert(Array.isArray(ring) && ring.length >= 4, `Land ${id}: Ring ${polygonIndex}/${ringIndex} ist zu kurz`);

            const first = ring[0];
            const last = ring.at(-1);
            assert(first[0] === last[0] && first[1] === last[1], `Land ${id}: Ring ${polygonIndex}/${ringIndex} ist nicht geschlossen`);

            ring.forEach(([longitude, latitude]) => {
               assertFiniteNumber(latitude, `Land ${id}: ungueltige Latitude`);
               assertFiniteNumber(longitude, `Land ${id}: ungueltige Longitude`);
               assert(latitude >= 34 && latitude <= 72 && longitude >= -25 && longitude <= 45, `Land ${id}: Koordinaten liegen ausserhalb des Europa-Kontexts`);
            });
         });
      });
   });
}

const points = await readJson(files.points);
const pipelines = await readJson(files.pipelines);
const countries = await readJson(files.countries);

validatePoints(points);
validatePipelines(pipelines);
validateCountries(countries);

const technicalPointCount = points.reduce((count, point) => count + point.points.length, 0);
console.log(`Datenvalidierung ok: ${points.length} Punkte, ${technicalPointCount} technische Punkte, ${pipelines.features.length} Leitungen, ${countries.features.length} Länder.`);
