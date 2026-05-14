import { Check, ChevronsUpDown, Flame, MapPin, RotateCcw, Route, Search, X } from "lucide-react";

import { formatValue, mainDirectionLabel, pointTypeLabel, routeDisplayLabel } from "@/lib/domain/formatters";
import { cn } from "@/lib/utils";

function SegmentGroup({ disabled = false, label, icon: Icon, options, value, onChange }) {
   return (
      <section className={cn("flex flex-col gap-2 border-t border-border pt-4", disabled && "opacity-45")} aria-disabled={disabled || undefined} aria-label={label}>
         <h2 className="mb-0 flex items-center gap-2 text-sm font-medium text-card-foreground">
            <Icon aria-hidden="true" className="size-4" /> {label}
         </h2>
         <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
            {options.map(option => {
               const active = value === option.value;

               return (
                  <button
                     key={String(option.value)}
                     aria-label={`${label}: ${option.label}`}
                     aria-pressed={active}
                     className={cn(
                        "inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-muted px-2.5 text-[0.72rem] text-foreground transition-colors hover:border-primary/70 hover:bg-primary/20 hover:text-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-muted disabled:hover:text-foreground max-xl:min-h-10",
                        active && "border-primary/80 bg-primary/15 text-card-foreground"
                     )}
                     disabled={disabled}
                     onClick={() => onChange(option.value)}
                     type="button"
                  >
                     {active && <Check aria-hidden="true" className="size-3" />}
                     <span>{option.label}</span>
                  </button>
               );
            })}
         </div>
      </section>
   );
}

function LayerToggle({ active, children, onClick }) {
   return (
      <button
         aria-pressed={active}
         className="inline-flex min-w-0 min-h-9 items-center justify-between gap-2 rounded-md border border-border bg-muted px-2.5 text-[0.72rem] text-foreground transition-colors hover:border-primary/70 hover:bg-primary/20 hover:text-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none max-xl:min-h-10"
         onClick={onClick}
         type="button"
      >
         <span className="min-w-0 truncate">{children}</span>
         <span aria-hidden="true" className={cn("size-2 rounded-full bg-border", active && "bg-primary")} />
      </button>
   );
}

function ResultItem({ result, onSelect }) {
   const isPoint = result.kind === "point";
   const item = result.item;
   const title = isPoint ? item.name : result.title;
   const meta = isPoint
      ? `${item.id} · ${pointTypeLabel(item.point_type)} · ${mainDirectionLabel(item.direction)} · ${item.gas_type}`
      : `${item.properties.id} · ${routeDisplayLabel(item.properties)} · ${formatValue(item.properties.length_km, " km")}`;
   const Icon = isPoint ? MapPin : Route;

   return (
      <li>
         <button
            className="grid min-h-13 w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-2.5 rounded-md border border-border bg-muted p-2.5 text-left text-foreground transition-colors hover:border-primary/70 hover:bg-primary/20 hover:text-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            onClick={() => onSelect(result)}
            type="button"
         >
            <Icon aria-hidden="true" className="mt-0.5 size-4 text-primary" />
            <span className="grid min-w-0 gap-1">
               <strong className="min-w-0 text-xs font-medium break-words text-card-foreground">{title}</strong>
               <small className="min-w-0 text-[0.68rem] break-words text-muted-foreground">{meta}</small>
            </span>
         </button>
      </li>
   );
}

export default function ControlPanel({
   gasTypes,
   layerVisibility,
   mainDirectionTypes,
   onLayerChange,
   onResetFilters,
   onSearchTermChange,
   onSelectResult,
   pointTypes,
   relationTypes,
   results,
   searchTerm,
   selectedGasType,
   selectedMainDirection,
   selectedPointType,
   selectedRelation,
   setSelectedGasType,
   setSelectedMainDirection,
   setSelectedPointType,
   setSelectedRelation
}) {
   return (
      <aside className="flex min-h-0 flex-col gap-4 overflow-auto border border-border bg-muted/75 p-4 max-lg:order-2" aria-label="Filter und Treffer">
         <section className="grid grid-cols-1 gap-2 3xs:grid-cols-2" aria-label="Kartenebenen">
            <LayerToggle active={layerVisibility.showPipelines} onClick={() => onLayerChange("showPipelines")}>Leitungen</LayerToggle>
            <LayerToggle active={layerVisibility.showPoints} onClick={() => onLayerChange("showPoints")}>Punkte</LayerToggle>
         </section>

         <SegmentGroup disabled={!layerVisibility.showPoints} icon={MapPin} label="Punktart" value={selectedPointType} onChange={setSelectedPointType} options={pointTypes} />
         <SegmentGroup disabled={!layerVisibility.showPoints} icon={ChevronsUpDown} label="Hauptrichtung" value={selectedMainDirection} onChange={setSelectedMainDirection} options={mainDirectionTypes} />
         <SegmentGroup icon={Flame} label="Gasart" value={selectedGasType} onChange={setSelectedGasType} options={gasTypes} />
         <SegmentGroup disabled={!layerVisibility.showPipelines} icon={Route} label="Leitungen" value={selectedRelation} onChange={setSelectedRelation} options={relationTypes} />

         <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-border bg-muted px-3 text-xs font-medium text-foreground transition-colors hover:border-primary/70 hover:bg-primary/20 hover:text-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            onClick={onResetFilters}
            type="button"
         >
            <RotateCcw aria-hidden="true" className="size-4" />
            <span>Standardansicht</span>
         </button>

         <label className="grid min-h-10 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-md border border-border bg-popover px-3 text-muted-foreground focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
            <Search aria-hidden="true" className="size-4" />
            <input
               aria-label="Suche nach Punkt, ID, Leitung oder Operator"
               value={searchTerm}
               onChange={event => onSearchTermChange(event.target.value)}
               placeholder="Suche"
               type="text"
               className="min-w-0 border-0 bg-transparent text-sm text-popover-foreground outline-none placeholder:text-muted-foreground/70"
            />
            {searchTerm && (
               <button
                  className="inline-grid size-6 place-items-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  onClick={() => onSearchTermChange("")}
                  type="button"
                  aria-label="Suche löschen"
               >
                  <X aria-hidden="true" className="size-3.5" />
               </button>
            )}
         </label>

         {results.active && (
            <section className="flex min-h-64 flex-1 flex-col gap-2 overflow-auto border-t border-border bg-muted/95 pr-1" aria-label="Treffer">
               <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-border bg-muted px-0.5 py-2 text-[0.7rem] text-muted-foreground" aria-live="polite">
                  <span>Treffer</span>
                  <strong className="font-medium text-card-foreground">{results.total}</strong>
               </div>
               {results.items.length === 0 ? (
                  <div className="flex min-h-11 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">Keine Treffer</div>
               ) : (
                  <ul className="grid gap-2 p-0">
                     {results.items.map(result => (
                        <ResultItem key={`${result.kind}-${result.kind === "point" ? result.item.id : result.item.properties.id}`} result={result} onSelect={onSelectResult} />
                     ))}
                  </ul>
               )}
            </section>
         )}
      </aside>
   );
}
