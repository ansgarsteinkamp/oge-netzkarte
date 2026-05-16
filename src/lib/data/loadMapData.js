import { stripBom } from "../domain/text.js";

const DATA_FILES = {
   points: "data/punkte.json",
   pipelines: "data/leitungen_v2.geojson",
   countries: "data/countries_v2.geojson"
};

const parseJsonResponse = async response => JSON.parse(stripBom(await response.text()));

export async function loadMapData(baseUrl) {
   const [pointsResponse, pipelinesResponse, countriesResponse] = await Promise.all([
      fetch(`${baseUrl}${DATA_FILES.points}`),
      fetch(`${baseUrl}${DATA_FILES.pipelines}`),
      fetch(`${baseUrl}${DATA_FILES.countries}`)
   ]);

   if (!pointsResponse.ok || !pipelinesResponse.ok || !countriesResponse.ok) {
      throw new Error("Daten konnten nicht geladen werden.");
   }

   const [points, pipelineCollection, countries] = await Promise.all([
      parseJsonResponse(pointsResponse),
      parseJsonResponse(pipelinesResponse),
      parseJsonResponse(countriesResponse)
   ]);

   return { countries, pipelineCollection, points };
}
