import { EUROPE_CONTEXT_IDS, GERMANY_ID } from "../domain/constants.js";

const parseCountryId = id => String(id).padStart(3, "0");

export const buildGermanyCollection = countries => ({
   type: "FeatureCollection",
   features: countries.features.filter(country => parseCountryId(country.id) === GERMANY_ID)
});

export const buildEuropeContextCollection = countries => ({
   type: "FeatureCollection",
   features: countries.features.filter(country => EUROPE_CONTEXT_IDS.has(parseCountryId(country.id)) && parseCountryId(country.id) !== GERMANY_ID)
});
