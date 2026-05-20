import { GERMANY_ID } from "../domain/constants.js";

const parseCountryId = id => String(id).padStart(3, "0");

export const buildGermanyCollection = countries => ({
   type: "FeatureCollection",
   features: countries.features.filter(country => parseCountryId(country.id) === GERMANY_ID)
});

export const buildEuropeContextCollection = countries => ({
   type: "FeatureCollection",
   features: countries.features.filter(country => parseCountryId(country.id) !== GERMANY_ID)
});
