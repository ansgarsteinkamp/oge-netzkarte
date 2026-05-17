import { useRef } from "react";
import { Check, Flame, MapPin, RotateCcw, Route, Search, X } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { gasQualityLabel, pipelineStatusExceptionLabel } from "@/lib/domain/formatters";
import { pointResultMeta } from "@/lib/domain/search";
import { cn } from "@/lib/utils";

function SegmentGroup({ disabled = false, label, icon: Icon, options, value, onChange }) {
   return (
      <section className={cn("flex flex-col gap-2 border-t border-border pt-3", disabled && "opacity-45")} aria-disabled={disabled || undefined} aria-label={label}>
         <h2 className="mb-0 flex items-center gap-1.5 text-xs font-medium text-card-foreground">
            <Icon aria-hidden="true" className="size-3.5" /> {label}
         </h2>
         <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
            {options.map(option => {
               const active = value === option.value;

               const button = (
                  <button
                     aria-label={`${label}: ${option.label}`}
                     aria-pressed={active}
                     className={cn(
                        "inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-muted px-2.5 text-[0.72rem] text-foreground transition-colors hover:border-primary/70 hover:bg-primary/20 hover:text-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:bg-muted disabled:hover:text-foreground max-lg:min-h-10",
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

               return option.description ? (
                  <Tooltip key={String(option.value)}>
                     <TooltipTrigger asChild>{button}</TooltipTrigger>
                     <TooltipContent
                        side="right"
                        sideOffset={6}
                        className="z-[1200] w-max max-w-64 text-left leading-snug"
                     >
                        {option.description.split("\n").map(line => (
                           <span key={line} className="block whitespace-nowrap">{line}</span>
                        ))}
                     </TooltipContent>
                  </Tooltip>
               ) : (
                  <span key={String(option.value)}>{button}</span>
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
         className="inline-flex min-w-0 min-h-9 items-center justify-between gap-2 rounded-md border border-border bg-muted px-2.5 text-[0.72rem] text-foreground transition-colors hover:border-primary/70 hover:bg-primary/20 hover:text-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none max-lg:min-h-10"
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
      ? pointResultMeta(item, result.match)
      : [
           item.properties.id,
           item.properties.name !== item.properties.line_name ? item.properties.name : null,
           gasQualityLabel(item.properties.gas_quality),
           pipelineStatusExceptionLabel(item.properties.status)
        ]
           .filter(Boolean)
           .join(" · ");
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
   className,
   gasTypes,
   layerVisibility,
   onLayerChange,
   onResetFilters,
   onSearchTermChange,
   onSelectResult,
   pointCategories,
   relationTypes,
   results,
   searchTerm,
   selectedGasType,
   selectedPointCategory,
   selectedRelation,
   setSelectedGasType,
   setSelectedPointCategory,
   setSelectedRelation
}) {
   const searchInputRef = useRef(null);

   const clearSearch = () => {
      onSearchTermChange("");
      window.requestAnimationFrame(() => searchInputRef.current?.focus());
   };

   return (
      <aside className={cn("flex min-h-0 flex-col gap-3 overflow-auto border border-border bg-muted/75 p-3.5", className)} aria-label="Filter und Treffer">
         <section className="grid grid-cols-1 gap-1.5 3xs:grid-cols-2" aria-label="Kartenebenen">
            <LayerToggle active={layerVisibility.showPipelines} onClick={() => onLayerChange("showPipelines")}>Leitungen</LayerToggle>
            <LayerToggle active={layerVisibility.showPoints} onClick={() => onLayerChange("showPoints")}>Punkte</LayerToggle>
         </section>

         <SegmentGroup disabled={!layerVisibility.showPoints} icon={MapPin} label="Punktkategorie" value={selectedPointCategory} onChange={setSelectedPointCategory} options={pointCategories} />
         <SegmentGroup icon={Flame} label="Gasqualität" value={selectedGasType} onChange={setSelectedGasType} options={gasTypes} />
         <SegmentGroup disabled={!layerVisibility.showPipelines} icon={Route} label="Leitungsbezug" value={selectedRelation} onChange={setSelectedRelation} options={relationTypes} />

         <button
            className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-border/70 bg-transparent px-3 text-[0.72rem] font-medium text-foreground transition-colors hover:border-primary/70 hover:bg-muted hover:text-secondary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            onClick={onResetFilters}
            type="button"
         >
            <RotateCcw aria-hidden="true" className="size-4" />
            <span>Standardansicht</span>
         </button>

         <label className="grid min-h-9 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-border bg-field px-2.5 text-muted-foreground focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
            <Search aria-hidden="true" className="size-3.5" />
            <input
               aria-label="Suche nach Punkt, Leitung, Betreiber, EIC oder Location-ID"
               ref={searchInputRef}
               value={searchTerm}
               onChange={event => onSearchTermChange(event.target.value)}
               placeholder="Suche"
               type="text"
               className="min-w-0 border-0 bg-transparent text-xs leading-5 text-popover-foreground outline-none placeholder:text-muted-foreground/65"
            />
            {searchTerm && (
               <button
                  className="inline-grid size-6 place-items-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  onClick={clearSearch}
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
