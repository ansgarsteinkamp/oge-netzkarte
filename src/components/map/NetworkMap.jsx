import CountryLayers from "@/components/map/CountryLayers";
import MapCameraEffects from "@/components/map/MapCameraEffects";
import MapLegend from "@/components/map/MapLegend";
import MapViewport from "@/components/map/MapViewport";
import MapZoomControls from "@/components/map/MapZoomControls";
import PipelineLayer from "@/components/map/PipelineLayer";
import PointLayer from "@/components/map/PointLayer";

export default function NetworkMap({
   europeContext,
   filteredPipelines,
   filteredPoints,
   germany,
   layerVisibility,
   onSelectPipeline,
   onSelectPoint,
   pipelineLayerKey,
   pointOffsets,
   resetViewKey,
   searchBounds,
   selection
}) {
   return (
      <MapViewport>
         <MapCameraEffects pointOffsets={pointOffsets} resetViewKey={resetViewKey} searchBounds={searchBounds} selection={selection} />
         <MapZoomControls />
         <CountryLayers europeContext={europeContext} germany={germany} />
         <PipelineLayer visible={layerVisibility.showPipelines} pipelines={filteredPipelines} layerKey={pipelineLayerKey} onSelectPipeline={onSelectPipeline} />
         <PointLayer visible={layerVisibility.showPoints} points={filteredPoints} pointOffsets={pointOffsets} onSelectPoint={onSelectPoint} />
         <MapLegend />
      </MapViewport>
   );
}
