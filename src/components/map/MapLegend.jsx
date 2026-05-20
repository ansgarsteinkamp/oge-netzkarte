import { POINT_CATEGORY_ORDER, RELATION_FILTERS } from "@/lib/domain/constants";
import { pointCategoryLabel } from "@/lib/domain/formatters";
import { PARTICIPATION_LINE_PATTERN, POINT_CATEGORY_COLORS, RELATION_COLORS } from "@/lib/map/theme";

const dashedLineBackground = color => `repeating-linear-gradient(
   90deg,
   ${color} 0 ${PARTICIPATION_LINE_PATTERN.dash}px,
   transparent ${PARTICIPATION_LINE_PATTERN.dash}px ${PARTICIPATION_LINE_PATTERN.dash + PARTICIPATION_LINE_PATTERN.gap}px
)`;

const relationLegendEntry = ({ label, value }) => {
   const color = RELATION_COLORS[value];
   const isDashed = value === "co_owned_affiliate" || value === "owned_affiliate";

   return { label, kind: "line", style: { background: isDashed ? dashedLineBackground(color) : color } };
};

const pointLegendEntry = category => ({
   label: pointCategoryLabel(category),
   kind: "dot",
   style: { background: POINT_CATEGORY_COLORS[category] }
});

const entries = [
   ...RELATION_FILTERS.map(relationLegendEntry),
   ...POINT_CATEGORY_ORDER.map(pointLegendEntry)
];

export default function MapLegend() {
   return (
      <div className="absolute right-3.5 bottom-3.5 left-3.5 z-[500] flex flex-wrap gap-x-3.5 gap-y-2 border border-border bg-muted/90 px-3 py-2.5 text-[0.72rem] text-muted-foreground backdrop-blur-md max-sm:hidden">
         {entries.map(entry => (
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
         ))}
      </div>
   );
}
