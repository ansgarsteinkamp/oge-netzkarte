import { readFile } from "node:fs/promises";

import {
   GAS_TYPE_ORDER,
   GERMANY_ID,
   MAIN_DIRECTION_ORDER,
   POINT_TYPE_ORDER,
   RELATION_FILTERS,
   RELATION_LABELS,
   VALID_PIPELINE_GAS_QUALITIES,
   VALID_PIPELINE_STATUSES
} from "../src/lib/domain/constants.js";

const files = {
   points: "public/data/punkte.json",
   pipelines: "public/data/leitungen_v2.geojson",
   countries: "public/data/countries_v2.geojson"
};

const requiredPointFields = ["id", "name", "point_type", "gas_type", "latitude", "longitude"];
const validPointDirections = new Set(MAIN_DIRECTION_ORDER);
const nullableDirectionPointTypes = new Set(["Speicher", "NKP-GÜ", "NKP-MAP"]);
const validPointTypes = new Set(POINT_TYPE_ORDER);
const validPointGasTypes = new Set(GAS_TYPE_ORDER);
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

function assertFiniteNumber(value, message) {
   assert(Number.isFinite(value), message);
}

function assertOptionalNonEmptyString(value, message) {
   assert(value === null || value === undefined || (typeof value === "string" && value.trim() !== ""), message);
}

function assertUniqueIds(items, getter, label) {
   const ids = items.map(getter).filter(Boolean);
   const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
   assert(duplicates.length === 0, `${label}: doppelte IDs gefunden: ${[...new Set(duplicates)].join(", ")}`);
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
   assert(Array.isArray(points), "punkte.json muss ein Array sein");
   assert(points.length > 0, "punkte.json enthält keine Punkte");
   assertUniqueIds(points, point => point.id, "Punkte");

   points.forEach(point => {
      requiredPointFields.forEach(field => assert(point[field] !== undefined && point[field] !== null && point[field] !== "", `Punkt ${point.id ?? "ohne ID"}: Feld ${field} fehlt`));
      assert("direction" in point, `Punkt ${point.id ?? "ohne ID"}: Feld direction fehlt`);
      assertNonEmptyString(point.id, `Punkt ${point.id ?? "ohne ID"}: id muss ein Text sein`);
      assertNonEmptyString(point.name, `Punkt ${point.id}: name muss ein Text sein`);
      assert(validPointTypes.has(point.point_type), `Punkt ${point.id}: point_type ist ungültig`);
      assert(validPointGasTypes.has(point.gas_type), `Punkt ${point.id}: gas_type ist ungültig`);
      assert(validPointDirections.has(point.direction), `Punkt ${point.id}: direction ist ungültig`);
      assert(point.direction !== null || nullableDirectionPointTypes.has(point.point_type), `Punkt ${point.id}: direction darf nur bei Speichern, GÜP oder MAP null sein`);
      assertFiniteNumber(point.latitude, `Punkt ${point.id}: latitude ist ungültig`);
      assertFiniteNumber(point.longitude, `Punkt ${point.id}: longitude ist ungültig`);
      assert(point.latitude >= 45 && point.latitude <= 56 && point.longitude >= 3 && point.longitude <= 17, `Punkt ${point.id}: Koordinaten liegen außerhalb des erwarteten Kartenraums`);
      assertOptionalNonEmptyString(point.description, `Punkt ${point.id}: description ist ungültig`);
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
      assertNonEmptyString(feature.properties.id, `Leitung ${feature.properties?.id ?? "ohne ID"}: id muss ein Text sein`);
      assert(feature.id === feature.properties.id, `Leitung ${feature.properties.id}: feature.id und properties.id müssen identisch sein`);
      assertNonEmptyString(feature.properties.name, `Leitung ${feature.properties.id}: name muss ein Text sein`);
      assertNonEmptyString(feature.properties.line_name, `Leitung ${feature.properties.id}: line_name muss ein Text sein`);
      assertNonEmptyString(feature.properties.system_id, `Leitung ${feature.properties.id}: system_id muss ein Text sein`);
      assertNonEmptyString(feature.properties.operator, `Leitung ${feature.properties.id}: operator muss ein Text sein`);
      assert(validPipelineRelationTypes.has(feature.properties.oge_role), `Leitung ${feature.properties.id}: oge_role ist ungültig`);
      assert(VALID_PIPELINE_GAS_QUALITIES.has(feature.properties.gas_quality), `Leitung ${feature.properties.id}: gas_quality ist ungültig`);
      assert(VALID_PIPELINE_STATUSES.has(feature.properties.status), `Leitung ${feature.properties.id}: status ist ungültig`);
      assertNonEmptyString(feature.properties.source, `Leitung ${feature.properties.id}: source muss ein Text sein`);
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

console.log(`Datenvalidierung ok: ${points.length} Punkte, ${pipelines.features.length} Leitungen, ${countries.features.length} Länder.`);
