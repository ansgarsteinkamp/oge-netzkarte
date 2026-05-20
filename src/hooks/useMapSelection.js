import { useEffect, useRef, useState } from "react";

export function useMapSelection({ filteredPipelines, filteredPoints, layerVisibility, results }) {
   const [selection, setSelection] = useState(null);
   const activationId = useRef(0);

   const nextActivationId = () => {
      activationId.current += 1;
      return activationId.current;
   };

   useEffect(() => {
      if (!selection) return;

      if (selection.kind === "point") {
         const pointVisible = layerVisibility.showPoints && filteredPoints.some(point => point.id === selection.item.id);
         if (!pointVisible) setSelection(null);
         if (!pointVisible) return;

         if (selection.source === "result" && results.active) {
            const pointResult = results.items.find(result => result.kind === "point" && result.item.id === selection.item.id);
            const currentEic = selection.technicalPoint?.eic ?? null;
            const nextTechnicalPoint = pointResult?.technicalPoint ?? null;
            const nextEic = nextTechnicalPoint?.eic ?? null;

            if (nextEic !== currentEic) {
               setSelection({
                  kind: "point",
                  item: selection.item,
                  source: "result",
                  technicalPoint: nextTechnicalPoint,
                  activationId: nextActivationId()
               });
            }
         }

         return;
      }

      if (selection.kind === "pipeline") {
         const pipelineVisible = layerVisibility.showPipelines && filteredPipelines.features.some(item => item.properties.id === selection.item.properties.id);
         if (!pipelineVisible) setSelection(null);
      }
   }, [filteredPipelines, filteredPoints, layerVisibility.showPipelines, layerVisibility.showPoints, results, selection]);

   const selectPoint = (item, technicalPoint = null, source = "map") => {
      setSelection({ kind: "point", item, source, technicalPoint, activationId: nextActivationId() });
   };

   const selectPipeline = (item, source = "map") => {
      setSelection({ kind: "pipeline", item, source, activationId: nextActivationId() });
   };

   const selectResult = result => {
      if (result.kind === "point") {
         selectPoint(result.item, result.technicalPoint ?? null, "result");
         return;
      }

      selectPipeline(result.item, "result");
   };

   return {
      clearSelection: () => setSelection(null),
      selectPipeline,
      selectPoint,
      selectResult,
      selection
   };
}
