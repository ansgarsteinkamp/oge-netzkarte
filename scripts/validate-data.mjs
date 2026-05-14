import { readFile } from "node:fs/promises";

import { GAS_TYPE_ORDER, MAIN_DIRECTION_ORDER, POINT_TYPE_ORDER, RELATION_FILTERS, RELATION_LABELS, VALID_PIPELINE_GAS_QUALITIES } from "../src/lib/domain/constants.js";

const files = {
   points: "public/data/punkte.json",
   pipelines: "public/data/leitungsverlaeufe.geojson",
   countries: "public/data/countries.geojson"
};

const requiredPointFields = ["id", "name", "point_type", "gas_type", "latitude", "longitude"];
const validPointDirections = new Set(MAIN_DIRECTION_ORDER);
const nullableDirectionPointTypes = new Set(["Speicher", "NKP-GÜ", "NKP-MAP"]);
const validPointTypes = new Set(POINT_TYPE_ORDER);
const validPointGasTypes = new Set(GAS_TYPE_ORDER);
const validPipelineRelationTypes = new Set(Object.keys(RELATION_LABELS));
const filterRelationTypes = RELATION_FILTERS.flatMap(filter => filter.relationTypes);
const validFilterRelationTypes = new Set(filterRelationTypes);
const requiredPipelineFields = ["id", "relation_type", "route_label", "length_km", "gas_quality", "source", "source_license"];
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

function assertOptionalFiniteNumber(value, message) {
   assert(value === null || value === undefined || Number.isFinite(value), message);
}

function assertOptionalNonEmptyString(value, message) {
   assert(value === null || value === undefined || (typeof value === "string" && value.trim() !== ""), message);
}

function assertOptionalStringArray(value, message) {
   assert(value === null || value === undefined || (Array.isArray(value) && value.every(item => typeof item === "string" && item.trim() !== "")), message);
}

function assertUniqueIds(items, getter, label) {
   const ids = items.map(getter).filter(Boolean);
   const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
   assert(duplicates.length === 0, `${label}: doppelte IDs gefunden: ${[...new Set(duplicates)].join(", ")}`);
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
      assert(feature.geometry?.type === "LineString", `Leitung ${feature.properties?.id ?? "ohne ID"}: nur LineString wird unterstützt`);
      assert(Array.isArray(feature.geometry.coordinates) && feature.geometry.coordinates.length >= 2, `Leitung ${feature.properties?.id}: Geometrie ist zu kurz`);
      requiredPipelineFields.forEach(field => assert(feature.properties?.[field] !== undefined && feature.properties?.[field] !== null && feature.properties?.[field] !== "", `Leitung ${feature.properties?.id ?? "ohne ID"}: Feld ${field} fehlt`));
      assertNonEmptyString(feature.properties.id, `Leitung ${feature.properties?.id ?? "ohne ID"}: id muss ein Text sein`);
      assertNonEmptyString(feature.properties.route_label, `Leitung ${feature.properties.id}: route_label muss ein Text sein`);
      assert(validPipelineRelationTypes.has(feature.properties.relation_type), `Leitung ${feature.properties.id}: relation_type ist ungültig`);
      assert(VALID_PIPELINE_GAS_QUALITIES.has(feature.properties.gas_quality), `Leitung ${feature.properties.id}: gas_quality ist ungültig`);
      assertFiniteNumber(feature.properties.length_km, `Leitung ${feature.properties.id}: length_km ist ungültig`);
      assert(feature.properties.length_km > 0, `Leitung ${feature.properties.id}: length_km muss größer als 0 sein`);
      assertNonEmptyString(feature.properties.source, `Leitung ${feature.properties.id}: source muss ein Text sein`);
      assertNonEmptyString(feature.properties.source_license, `Leitung ${feature.properties.id}: source_license muss ein Text sein`);
      assertOptionalNonEmptyString(feature.properties.operator, `Leitung ${feature.properties.id}: operator ist ungültig`);
      assertOptionalNonEmptyString(feature.properties.source_operator, `Leitung ${feature.properties.id}: source_operator ist ungültig`);
      assertOptionalNonEmptyString(feature.properties.participation_note, `Leitung ${feature.properties.id}: participation_note ist ungültig`);
      assertOptionalStringArray(feature.properties.owners, `Leitung ${feature.properties.id}: owners ist ungültig`);
      assertOptionalStringArray(feature.properties.co_owners, `Leitung ${feature.properties.id}: co_owners ist ungültig`);
      assertOptionalStringArray(feature.properties.source_references, `Leitung ${feature.properties.id}: source_references ist ungültig`);
      ["diameter_mm", "pressure_bar", "capacity_m_m3_per_d"].forEach(field => assertOptionalFiniteNumber(feature.properties[field], `Leitung ${feature.properties.id}: ${field} ist ungültig`));
      feature.geometry.coordinates.forEach(([longitude, latitude]) => {
         assertFiniteNumber(latitude, `Leitung ${feature.properties.id}: ungültige Latitude`);
         assertFiniteNumber(longitude, `Leitung ${feature.properties.id}: ungültige Longitude`);
      });
   });
}

function validateCountries(collection) {
   validateFeatureCollection(collection, "Länder");
   assert(collection.features.some(feature => String(feature.id).padStart(3, "0") === "276"), "Länder: Deutschland fehlt");
}

const points = await readJson(files.points);
const pipelines = await readJson(files.pipelines);
const countries = await readJson(files.countries);

validatePoints(points);
validatePipelines(pipelines);
validateCountries(countries);

console.log(`Datenvalidierung ok: ${points.length} Punkte, ${pipelines.features.length} Leitungen, ${countries.features.length} Länder.`);
