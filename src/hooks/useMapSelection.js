import { useEffect, useState } from "react";

export function useMapSelection({ filteredPipelines, filteredPoints, layerVisibility, pointOffsets }) {
   const [selection, setSelection] = useState(null);

   useEffect(() => {
      if (!selection) return;

      if (selection.kind === "point" && (!layerVisibility.showPoints || !filteredPoints.some(point => point.id === selection.item.id))) {
         setSelection(null);
      }

      if (selection.kind === "pipeline" && (!layerVisibility.showPipelines || !filteredPipelines.features.some(item => item.properties.id === selection.item.properties.id))) {
         setSelection(null);
      }
   }, [filteredPipelines, filteredPoints, layerVisibility.showPipelines, layerVisibility.showPoints, selection]);

   const selectPoint = (item, isOffset = false) => {
      setSelection({ kind: "point", item, isOffset });
   };

   const selectPipeline = item => {
      setSelection({ kind: "pipeline", item });
   };

   const selectResult = result => {
      if (result.kind === "point") {
         const center = pointOffsets.get(result.item.id);
         const isOffset = center?.[0] !== result.item.latitude || center?.[1] !== result.item.longitude;
         selectPoint(result.item, isOffset);
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
