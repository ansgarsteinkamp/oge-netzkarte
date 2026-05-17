import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import TooltipIconButton from "@/components/TooltipIconButton";
import { cleanName, formatCoordinate, gasQualityLabel, operatorReferenceLabel, pipelineStatusExceptionLabel, pointCategoryLabel, pointGasQualityLabel, relationDetailDescription, relationLabel } from "@/lib/domain/formatters";

function DetailRow({ label, value }) {
   return (
      <div className="grid min-h-9 grid-cols-[minmax(96px,0.42fr)_minmax(0,1fr)] gap-2.5 border-b border-border/70 py-2 text-xs @max-[340px]:grid-cols-1 @max-[340px]:gap-1">
         <span className="text-muted-foreground">{label}</span>
         <strong className="min-w-0 font-normal break-words text-card-foreground">{value}</strong>
      </div>
   );
}

function MetadataLine({ label, value }) {
   return (
      <p className="m-0 font-mono text-[0.68rem] leading-relaxed break-words text-muted-foreground">
         <span>{label}: </span>
         <span>{value}</span>
      </p>
   );
}

function CoordinateRows({ lat, lon }) {
   return (
      <>
         <DetailRow label="Längengrad" value={`${formatCoordinate(lon)}°`} />
         <DetailRow label="Breitengrad" value={`${formatCoordinate(lat)}°`} />
      </>
   );
}

function TechnicalPoints({ activeLocationId, points }) {
   if (!points?.length) return null;

   const heading = points.length === 1 ? "Technischer Punkt" : `Technische Punkte (${points.length})`;

   return (
      <section className="mt-3 border-t border-border pt-3" aria-label="Technische Punkte">
         <h3 className="m-0 text-[0.72rem] font-medium text-primary uppercase">{heading}</h3>
         <div className="mt-2 grid gap-2">
            {points.map(point => (
               <div
                  key={point.location_id}
                  aria-current={point.location_id === activeLocationId ? "true" : undefined}
                  className="border-b border-border/70 pb-2 last:border-b-0 last:pb-0 aria-current:border-l-2 aria-current:border-l-primary aria-current:pl-2"
               >
                  <p className="m-0 text-xs leading-snug font-medium break-words text-card-foreground">{point.label}</p>
                  <div className="mt-1 grid gap-0.5">
                     <MetadataLine label="Location-ID" value={point.location_id} />
                     <MetadataLine label="EIC" value={point.eic} />
                     <MetadataLine label="Längengrad" value={`${formatCoordinate(point.lon)}°`} />
                     <MetadataLine label="Breitengrad" value={`${formatCoordinate(point.lat)}°`} />
                  </div>
               </div>
            ))}
         </div>
      </section>
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
               <p className="m-0 text-[0.72rem] font-medium text-primary uppercase">{pointCategoryLabel(point.category)}</p>
               <h2 id="selection-panel-title" className="m-0 text-base leading-snug font-medium text-card-foreground">{point.name}</h2>
            </div>
            <div className="mt-4 grid border-t border-border">
               <DetailRow label="Gasqualität" value={pointGasQualityLabel(point.gas_quality)} />
               {point.adjacent_country && <DetailRow label="Anbindung" value={point.adjacent_country} />}
               {point.vip_name && <DetailRow label="VIP" value={point.vip_name} />}
               {point.zone && <DetailRow label="Zone" value={point.zone} />}
               <CoordinateRows lat={point.lat} lon={point.lon} />
            </div>
            {point.description && (
               <section className="mt-3 border-t border-border pt-3" aria-label="Einordnung">
                  <h3 className="m-0 text-[0.72rem] font-medium text-primary uppercase">Einordnung</h3>
                  <p className="mt-2 mb-0 text-xs leading-relaxed text-muted-foreground">{point.description}</p>
               </section>
            )}
            <TechnicalPoints points={point.points} activeLocationId={selection.technicalPoint?.location_id} />
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
