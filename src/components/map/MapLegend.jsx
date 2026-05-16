import { RELATION_FILTER_LABELS } from "@/lib/domain/constants";
import { pointTypeLabel } from "@/lib/domain/formatters";
import { PARTICIPATION_LINE_PATTERN, POINT_COLORS, RELATION_COLORS } from "@/lib/map/theme";

const dashedLineBackground = color => `repeating-linear-gradient(
   90deg,
   ${color} 0 ${PARTICIPATION_LINE_PATTERN.dash}px,
   transparent ${PARTICIPATION_LINE_PATTERN.dash}px ${PARTICIPATION_LINE_PATTERN.dash + PARTICIPATION_LINE_PATTERN.gap}px
)`;

const entries = [
   { label: RELATION_FILTER_LABELS.operator, kind: "line", style: { background: RELATION_COLORS.operator } },
   { label: RELATION_FILTER_LABELS.joint_operator, kind: "line", style: { background: RELATION_COLORS.joint_operator } },
   { label: RELATION_FILTER_LABELS.co_owned_affiliate, kind: "line", style: { background: dashedLineBackground(RELATION_COLORS.co_owned_affiliate) } },
   { label: RELATION_FILTER_LABELS.owned_affiliate, kind: "line", style: { background: dashedLineBackground(RELATION_COLORS.owned_affiliate) } },
   { label: pointTypeLabel("Speicher"), kind: "dot", style: { background: POINT_COLORS.Speicher } },
   { label: pointTypeLabel("NKP-GÜ"), kind: "dot", style: { background: POINT_COLORS["NKP-GÜ"] } },
   { label: pointTypeLabel("NKP-MAP"), kind: "dot", style: { background: POINT_COLORS["NKP-MAP"] } },
   { label: pointTypeLabel("LNG"), kind: "dot", style: { background: POINT_COLORS.LNG } }
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
