import { useMemo, useState } from "react";

import Topbar from "@/components/layout/Topbar";
import NetworkMap from "@/components/map/NetworkMap";
import ControlPanel from "@/components/panels/ControlPanel";
import QualityPanel from "@/components/panels/QualityPanel";
import SelectionPanel from "@/components/panels/SelectionPanel";
import { useMapData } from "@/hooks/useMapData";
import { useMapFilters } from "@/hooks/useMapFilters";
import { useMapSelection } from "@/hooks/useMapSelection";
import { buildEuropeContextCollection, buildGermanyCollection } from "@/lib/data/geoCollections";
import { buildPointOffsets } from "@/lib/map/pointOffsets";

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

function App() {
   const { countries, error, loading, pipelineCollection, points } = useMapData();

   if (loading) return <LoadingState />;
   if (error) return <DataErrorState error={error} />;

   return <LoadedApp countries={countries} pipelineCollection={pipelineCollection} points={points} />;
}

function LoadedApp({ countries, pipelineCollection, points }) {
   const [resetViewKey, setResetViewKey] = useState(0);
   const pointOffsets = useMemo(() => buildPointOffsets(points), [points]);
   const germany = useMemo(() => buildGermanyCollection(countries), [countries]);
   const europeContext = useMemo(() => buildEuropeContextCollection(countries), [countries]);

   const filters = useMapFilters({ pipelineCollection, pointOffsets, points });
   const selection = useMapSelection({
      filteredPipelines: filters.filteredPipelines,
      filteredPoints: filters.filteredPoints,
      layerVisibility: filters.layerVisibility,
      pointOffsets
   });

   const resetFilters = () => {
      filters.resetFilters();
      selection.clearSelection();
      setResetViewKey(value => value + 1);
   };

   return (
      <main className="min-h-svh bg-background p-4 text-foreground max-[840px]:p-3" style={{ background: "linear-gradient(180deg, rgba(217, 119, 87, 0.08), transparent 34%), var(--background)" }}>
         <Topbar />
         <section className="mx-auto grid min-h-[calc(100svh-128px)] max-w-[1700px] grid-cols-[22.5rem_minmax(420px,1fr)_minmax(240px,280px)] gap-4 xl:h-[calc(100svh-128px)] max-[1180px]:h-auto max-[1180px]:min-h-0 max-[1180px]:grid-cols-[22.5rem_minmax(430px,1fr)] max-[840px]:grid-cols-1">
            <ControlPanel
               gasTypes={filters.filterOptions.gasTypes}
               layerVisibility={filters.layerVisibility}
               mainDirectionTypes={filters.filterOptions.mainDirectionTypes}
               onLayerChange={filters.toggleLayer}
               onResetFilters={resetFilters}
               onSearchTermChange={filters.setSearchTerm}
               onSelectResult={selection.selectResult}
               pointTypes={filters.filterOptions.pointTypes}
               relationTypes={filters.filterOptions.relationTypes}
               results={filters.results}
               searchTerm={filters.searchTerm}
               selectedGasType={filters.selectedGasType}
               selectedMainDirection={filters.selectedMainDirection}
               selectedPointType={filters.selectedPointType}
               selectedRelation={filters.selectedRelation}
               setSelectedGasType={filters.setSelectedGasType}
               setSelectedMainDirection={filters.setSelectedMainDirection}
               setSelectedPointType={filters.setSelectedPointType}
               setSelectedRelation={filters.setSelectedRelation}
            />

            <NetworkMap
               europeContext={europeContext}
               filteredPipelines={filters.filteredPipelines}
               filteredPoints={filters.filteredPoints}
               germany={germany}
               layerVisibility={filters.layerVisibility}
               onSelectPipeline={selection.selectPipeline}
               onSelectPoint={selection.selectPoint}
               pipelineLayerKey={filters.pipelineLayerKey}
               pointOffsets={pointOffsets}
               query={filters.query}
               resetViewKey={resetViewKey}
               searchBounds={filters.searchBounds}
               selection={selection.selection}
            />

            <div className="flex min-h-0 flex-col gap-3.5 overflow-auto max-[1180px]:col-span-full max-[1180px]:grid max-[1180px]:grid-cols-2 max-[840px]:order-3 max-[840px]:grid-cols-1">
               <SelectionPanel selection={selection.selection} onClose={selection.clearSelection} />
               <QualityPanel />
            </div>
         </section>
      </main>
   );
}

export default App;
