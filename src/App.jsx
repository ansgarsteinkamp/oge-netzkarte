import { useMemo, useState } from "react";

import Topbar from "@/components/layout/Topbar";
import NetworkMap from "@/components/map/NetworkMap";
import ControlPanel from "@/components/panels/ControlPanel";
import SelectionPanel from "@/components/panels/SelectionPanel";
import { useMapData } from "@/hooks/useMapData";
import { useMapFilters } from "@/hooks/useMapFilters";
import { useMapSelection } from "@/hooks/useMapSelection";
import { buildEuropeContextCollection, buildGermanyCollection } from "@/lib/data/geoCollections";

function LoadingState() {
   return (
      <main className="grid min-h-svh place-items-center bg-background p-4 text-center text-card-foreground">
         <div role="status" aria-label="Daten werden geladen">
            <div className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
            <span className="sr-only">Daten werden geladen</span>
         </div>
      </main>
   );
}

function DataErrorState({ error }) {
   return (
      <main className="grid min-h-svh place-items-center bg-background p-4 text-center text-card-foreground">
         <div>
            <h1 className="mb-2 text-xl font-medium">Datenfehler</h1>
            <p className="m-0 text-sm text-muted-foreground">{error.message}</p>
         </div>
      </main>
   );
}

function DataBasisNote() {
   return (
      <p className="mt-2 mb-0 px-1 text-[0.62rem] leading-relaxed text-muted-foreground/70">
         Die Leitungen und Punkte wurden aus öffentlich zugänglichen Informationen zusammengestellt und vereinfacht aufbereitet; sie dienen ausschließlich der schnellen Orientierung.
      </p>
   );
}

function App() {
   const { countries, error, loading, pipelineCollection, points } = useMapData();

   if (loading) return <LoadingState />;
   if (error) return <DataErrorState error={error} />;

   return <LoadedApp countries={countries} pipelineCollection={pipelineCollection} points={points} />;
}

function LoadedApp({ countries, pipelineCollection, points }) {
   const [resetViewKey, setResetViewKey] = useState(0);
   const germany = useMemo(() => buildGermanyCollection(countries), [countries]);
   const europeContext = useMemo(() => buildEuropeContextCollection(countries), [countries]);

   const filters = useMapFilters({ pipelineCollection, points });
   const selection = useMapSelection({
      filteredPipelines: filters.filteredPipelines,
      filteredPoints: filters.filteredPoints,
      layerVisibility: filters.layerVisibility,
      results: filters.results
   });

   const resetFilters = () => {
      filters.resetFilters();
      selection.clearSelection();
      setResetViewKey(value => value + 1);
   };

   const closeSelection = () => {
      selection.clearSelection();
      window.requestAnimationFrame(() => document.querySelector(".leaflet-container")?.focus());
   };

   return (
      <main className="app-shell min-h-svh bg-background p-4 text-foreground max-lg:p-3">
         <Topbar />
         <section className="mx-auto grid min-h-[calc(100svh-128px)] max-w-[1700px] items-start gap-4 grid-cols-[21rem_minmax(430px,1fr)] min-[1360px]:grid-cols-[21rem_minmax(420px,1fr)_21rem] max-lg:grid-cols-1">
            <ControlPanel
               className={selection.selection ? "max-lg:order-3" : "max-lg:order-2"}
               gasTypes={filters.filterOptions.gasTypes}
               layerVisibility={filters.layerVisibility}
               onLayerChange={filters.toggleLayer}
               onResetFilters={resetFilters}
               onSearchTermChange={filters.setSearchTerm}
               onSelectResult={selection.selectResult}
               pointCategories={filters.filterOptions.pointCategories}
               relationTypes={filters.filterOptions.relationTypes}
               results={filters.results}
               searchTerm={filters.searchTerm}
               selectedGasType={filters.selectedGasType}
               selectedPointCategory={filters.selectedPointCategory}
               selectedRelation={filters.selectedRelation}
               setSelectedGasType={filters.setSelectedGasType}
               setSelectedPointCategory={filters.setSelectedPointCategory}
               setSelectedRelation={filters.setSelectedRelation}
            />

            <div className="flex min-h-0 flex-col self-start">
               <div className="min-h-0 min-[1360px]:h-[calc(100svh-128px)]">
                  <NetworkMap
                     europeContext={europeContext}
                     filteredPipelines={filters.filteredPipelines}
                     filteredPoints={filters.filteredPoints}
                     germany={germany}
                     layerVisibility={filters.layerVisibility}
                     onSelectPipeline={selection.selectPipeline}
                     onSelectPoint={selection.selectPoint}
                     pipelineLayerKey={filters.pipelineLayerKey}
                     resetViewKey={resetViewKey}
                     searchBounds={filters.searchBounds}
                     selection={selection.selection}
                  />
               </div>
               <DataBasisNote />
            </div>

            <div className={`flex min-h-0 flex-col overflow-auto min-[1360px]:col-auto max-[1359px]:col-start-2 max-[1359px]:col-span-1 max-lg:col-start-auto max-lg:col-span-1 ${selection.selection ? "max-lg:order-2" : "max-lg:order-3"}`}>
               <SelectionPanel selection={selection.selection} onClose={closeSelection} />
            </div>
         </section>
      </main>
   );
}

export default App;
