import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { POINT_CATEGORY_DESCRIPTIONS, POINT_CATEGORY_ORDER, RELATION_FILTERS } from "@/lib/domain/constants";
import { pointCategoryLabel } from "@/lib/domain/formatters";
import { getRelationSymbolBackground } from "@/lib/map/styles";
import { POINT_CATEGORY_COLORS } from "@/lib/map/theme";

const relationLegendEntry = ({ label, value }) => ({ label, kind: "line", style: { background: getRelationSymbolBackground(value) } });

const pointLegendEntry = category => ({
   label: pointCategoryLabel(category),
   description: POINT_CATEGORY_DESCRIPTIONS[category],
   kind: "dot",
   style: { background: POINT_CATEGORY_COLORS[category] }
});

const pipelineEntries = RELATION_FILTERS.map(relationLegendEntry);
const pointEntries = POINT_CATEGORY_ORDER.map(pointLegendEntry);

export default function MapLegend({ layerVisibility }) {
   const entries = [
      ...(layerVisibility.showPipelines ? pipelineEntries : []),
      ...(layerVisibility.showPoints ? pointEntries : [])
   ];

   if (entries.length === 0) return null;

   return (
      <div className="absolute right-3.5 bottom-3.5 left-3.5 z-[500] flex flex-wrap gap-x-3.5 gap-y-2 border border-border bg-muted/90 px-3 py-2.5 text-[0.72rem] text-muted-foreground backdrop-blur-md max-sm:hidden">
         {entries.map(entry => {
            const item = (
               <span key={entry.label} className="inline-flex items-center gap-2">
                  <span
                     aria-hidden="true"
                     className={
                        entry.kind === "line"
                           ? "h-0.75 w-6"
                           : "size-2.5 rounded-full border-2 border-background"
                     }
                     style={entry.style}
                  />
                  {entry.label}
               </span>
            );

            return entry.description ? (
               <Tooltip key={entry.label}>
                  <TooltipTrigger asChild>{item}</TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6} className="z-[1200]">{entry.description}</TooltipContent>
               </Tooltip>
            ) : item;
         })}
      </div>
   );
}
