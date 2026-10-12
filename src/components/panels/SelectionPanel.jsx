import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import TooltipIconButton from "@/components/TooltipIconButton";
import { adjacentOperatorLabel, cleanName, gasQualityLabel, operatorReferenceLabel, pipelineStatusExceptionLabel, pointCategoryLabel, pointGasQualityLabel, relationDetailDescription, relationLabel } from "@/lib/domain/formatters";

function DetailRow({ label, value }) {
   return (
      <div className="grid min-h-9 grid-cols-[minmax(96px,0.42fr)_minmax(0,1fr)] gap-2.5 border-b border-border/70 py-2 text-xs @max-[340px]:grid-cols-1 @max-[340px]:gap-1">
         <span className="text-muted-foreground">{label}</span>
         <strong className="min-w-0 font-normal break-words text-card-foreground">{value}</strong>
      </div>
   );
}

export default function SelectionPanel({ selection, onClose }) {
   const panelRef = useRef(null);

   useEffect(() => {
      if (!selection) return;

      panelRef.current?.focus({ preventScroll: true });
   }, [selection]);

   if (!selection) {
      return (
         <aside className="@container relative min-h-44 flex-none border border-border bg-muted/75 p-4 text-muted-foreground" aria-labelledby="selection-panel-title">
            <div>
               <p className="m-0 text-[0.72rem] font-medium text-primary uppercase">Auswahl</p>
               <h2 id="selection-panel-title" className="mt-1 mb-2 text-base leading-snug font-medium text-card-foreground">Keine Auswahl</h2>
            </div>
         </aside>
      );
   }

   if (selection.kind === "point") {
      const point = selection.item;

      return (
         <aside ref={panelRef} tabIndex={-1} className="@container relative flex-none border border-border bg-muted/75 p-4 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none" aria-labelledby="selection-panel-title" aria-live="polite">
            <TooltipIconButton label="Auswahl schließen" onClick={onClose} className="absolute top-3 right-3 size-8">
               <X aria-hidden="true" className="size-4" />
            </TooltipIconButton>
            <div className="grid gap-1 pr-8">
               <h2 id="selection-panel-title" className="m-0 text-base leading-snug font-medium text-card-foreground">{point.name}</h2>
            </div>
            <div className="mt-4 grid border-t border-border">
               <DetailRow label="Gasqualität" value={pointGasQualityLabel(point.gas_quality)} />
               {point.adjacent_country && <DetailRow label="Anbindung" value={point.adjacent_country} />}
               {point.adjacent_operator && <DetailRow label={adjacentOperatorLabel(point.category)} value={point.adjacent_operator} />}
               {point.vip_name && <DetailRow label="VIP" value={point.vip_name} />}
               {point.zone && <DetailRow label="Zone" value={point.zone} />}
               <DetailRow label="Punktkategorie" value={pointCategoryLabel(point.category)} />
            </div>
            {point.description && (
               <section className="mt-3 border-t border-border pt-3" aria-label="Einordnung">
                  <h3 className="m-0 text-[0.72rem] font-medium text-primary uppercase">Einordnung</h3>
                  <p className="mt-2 mb-0 text-xs leading-relaxed text-muted-foreground">{point.description}</p>
               </section>
            )}
         </aside>
      );
   }

   const props = selection.item.properties;
   const status = pipelineStatusExceptionLabel(props.status);

   return (
      <aside ref={panelRef} tabIndex={-1} className="@container relative flex-none border border-border bg-muted/75 p-4 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none" aria-labelledby="selection-panel-title" aria-live="polite">
         <TooltipIconButton label="Auswahl schließen" onClick={onClose} className="absolute top-3 right-3 size-8">
            <X aria-hidden="true" className="size-4" />
         </TooltipIconButton>
         <div className="grid gap-1 pr-8">
            <p className="m-0 text-[0.72rem] font-medium text-primary uppercase">{relationLabel(props.oge_role)}</p>
            <h2 id="selection-panel-title" className="m-0 text-base leading-snug font-medium text-card-foreground">{cleanName(selection.item)}</h2>
         </div>
         <div className="mt-4 grid border-t border-border">
            {props.name !== props.line_name && <DetailRow label="Abschnitt" value={props.name ?? "unbekannt"} />}
            <DetailRow label="OGE-Bezug" value={relationDetailDescription(props.oge_role) ?? "unbekannt"} />
            {status && <DetailRow label="Status" value={status} />}
            <DetailRow label="Gasqualität" value={gasQualityLabel(props.gas_quality)} />
            <DetailRow label={operatorReferenceLabel(props.oge_role)} value={props.operator ?? "unbekannt"} />
            <DetailRow label="Quelle" value={props.source ?? "unbekannt"} />
         </div>
      </aside>
   );
}
