import { X } from "lucide-react";

import TooltipIconButton from "@/components/TooltipIconButton";
import { RELATION_LABELS } from "@/lib/domain/constants";
import { cleanName, formatValue, mainDirectionLabel, pointTypeLabel } from "@/lib/domain/formatters";

function DetailRow({ label, value }) {
   return (
      <div className="grid min-h-9 grid-cols-[100px_minmax(0,1fr)] gap-2.5 border-b border-border/70 py-2 text-xs max-[560px]:grid-cols-1 max-[560px]:gap-1">
         <span className="text-muted-foreground">{label}</span>
         <strong className="min-w-0 font-normal break-words text-card-foreground">{value}</strong>
      </div>
   );
}

const formatCoordinate = value => (Number.isFinite(value) ? value.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "unbekannt");

export default function SelectionPanel({ selection, onClose }) {
   if (!selection) {
      return (
         <aside className="relative min-h-44 flex-none border border-border bg-muted/75 p-4 text-muted-foreground" aria-labelledby="selection-panel-title">
            <div>
               <p className="m-0 text-[0.72rem] font-medium text-primary uppercase">Auswahl</p>
               <h2 id="selection-panel-title" className="mt-1 mb-2 text-base leading-snug font-medium text-card-foreground">Keine Auswahl</h2>
               <p className="m-0 max-w-[30ch] text-xs leading-relaxed">Leitung oder Punkt anklicken, um Details und Quellenhinweise zu sehen.</p>
            </div>
         </aside>
      );
   }

   if (selection.kind === "point") {
      const point = selection.item;

      return (
         <aside className="relative flex-none border border-border bg-muted/75 p-4" aria-labelledby="selection-panel-title" aria-live="polite">
            <TooltipIconButton label="Auswahl schließen" onClick={onClose} className="absolute top-3 right-3 size-8">
               <X className="size-4" />
            </TooltipIconButton>
            <div className="grid gap-1 pr-8">
               <p className="m-0 text-[0.72rem] font-medium text-primary uppercase">{pointTypeLabel(point.point_type)}</p>
               <h2 id="selection-panel-title" className="m-0 text-base leading-snug font-medium text-card-foreground">{point.name}</h2>
            </div>
            <div className="mt-4 grid border-t border-border">
               <DetailRow label="ID" value={point.id} />
               <DetailRow label="Richtung" value={mainDirectionLabel(point.direction)} />
               <DetailRow label="Gasart" value={point.gas_type} />
               <DetailRow label="Koordinaten" value={`${formatCoordinate(point.latitude)}°, ${formatCoordinate(point.longitude)}°`} />
            </div>
            {point.description && (
               <section className="mt-3 border-t border-border pt-3" aria-label="Einordnung">
                  <h3 className="m-0 text-[0.72rem] font-medium text-primary uppercase">Einordnung</h3>
                  <p className="mt-2 mb-0 text-xs leading-relaxed text-muted-foreground">{point.description}</p>
               </section>
            )}
            {selection.isOffset && (
               <p className="mt-3 border-l-3 border-primary bg-accent p-2.5 text-xs leading-relaxed text-muted-foreground">
                  Marker wurde leicht versetzt dargestellt, weil mehrere Punkte dieselbe Koordinate nutzen.
               </p>
            )}
         </aside>
      );
   }

   const props = selection.item.properties;

   return (
      <aside className="relative flex-none border border-border bg-muted/75 p-4" aria-labelledby="selection-panel-title" aria-live="polite">
         <TooltipIconButton label="Auswahl schließen" onClick={onClose} className="absolute top-3 right-3 size-8">
            <X className="size-4" />
         </TooltipIconButton>
         <div className="grid gap-1 pr-8">
            <p className="m-0 text-[0.72rem] font-medium text-primary uppercase">{RELATION_LABELS[props.relation_type] ?? props.relation_type}</p>
            <h2 id="selection-panel-title" className="m-0 text-base leading-snug font-medium text-card-foreground">{cleanName(selection.item)}</h2>
         </div>
         <div className="mt-4 grid border-t border-border">
            <DetailRow label="Operator" value={props.operator ?? "unbekannt"} />
            <DetailRow label="Eigentümer" value={(props.owners ?? []).join(", ") || "unbekannt"} />
            <DetailRow label="Länge" value={formatValue(props.length_km, " km")} />
            <DetailRow label="Durchmesser" value={formatValue(props.diameter_mm, " mm")} />
            <DetailRow label="Druck" value={formatValue(props.pressure_bar, " bar")} />
            <DetailRow label="Kapazität (Modell)" value={formatValue(props.capacity_m_m3_per_d, " Mio. m³/d")} />
            <DetailRow label="Gasqualität" value={props.gas_quality ?? "unbekannt"} />
            <DetailRow label="Quelle" value={`${props.source ?? "unbekannt"} (${props.source_license ?? "Lizenz unbekannt"})`} />
         </div>
         {props.participation_note && <p className="mt-3 border-l-3 border-primary bg-accent p-2.5 text-xs leading-relaxed text-muted-foreground">{props.participation_note}</p>}
      </aside>
   );
}
