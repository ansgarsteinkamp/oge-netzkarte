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

      if (selection.kind === "point" && (!layerVisibility.showPoints || !filteredPoints.some(point => point.id === selection.item.id))) {
         setSelection(null);
      }

      if (selection.kind === "point" && selection.technicalPoint && results.active) {
         const pointResult = results.items.find(result => result.kind === "point" && result.item.id === selection.item.id);
         const currentLocationId = selection.technicalPoint.location_id;
         const nextLocationId = pointResult?.technicalPoint?.location_id;

         if (nextLocationId !== currentLocationId) {
            setSelection({
               kind: "point",
               item: selection.item,
               technicalPoint: pointResult?.technicalPoint ?? null,
               activationId: nextActivationId()
            });
         }
      }

      if (selection.kind === "pipeline" && (!layerVisibility.showPipelines || !filteredPipelines.features.some(item => item.properties.id === selection.item.properties.id))) {
         setSelection(null);
      }
   }, [filteredPipelines, filteredPoints, layerVisibility.showPipelines, layerVisibility.showPoints, results, selection]);

   const selectPoint = (item, technicalPoint = null) => {
      setSelection({ kind: "point", item, technicalPoint, activationId: nextActivationId() });
   };

   const selectPipeline = item => {
      setSelection({ kind: "pipeline", item, activationId: nextActivationId() });
   };

   const selectResult = result => {
      if (result.kind === "point") {
         selectPoint(result.item, result.technicalPoint ?? null);
         return;
      }

      selectPipeline(result.item);
   };

   return {
      clearSelection: () => setSelection(null),
      selectPipeline,
      selectPoint,
      selectResult,
      selection
   };
}
