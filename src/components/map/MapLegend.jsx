const entries = [
   { label: "OGE direkt", kind: "line", className: "bg-primary" },
   { label: "Gemeinsam", kind: "line", className: "bg-secondary" },
   { label: "OGE-Beteiligung", kind: "line", style: { background: "repeating-linear-gradient(90deg, #86b7a7 0 7px, transparent 7px 12px)" } },
   { label: "Speicher", kind: "dot", style: { background: "#86b7a7" } },
   { label: "GÜP", kind: "dot", className: "bg-primary" },
   { label: "MAP", kind: "dot", className: "bg-secondary" },
   { label: "LNG", kind: "dot", style: { background: "#d2a766" } }
];

export default function MapLegend() {
   return (
      <div className="absolute right-3.5 bottom-3.5 left-3.5 z-[500] flex flex-wrap gap-x-3.5 gap-y-2 border border-border bg-muted/90 px-3 py-2.5 text-[0.72rem] text-muted-foreground backdrop-blur-md max-[560px]:max-h-[34%] max-[560px]:overflow-auto max-[560px]:text-[0.66rem]">
         {entries.map(entry => (
            <span key={entry.label} className="inline-flex items-center gap-2">
               <i
                  aria-hidden="true"
                  className={
                     entry.kind === "line"
                        ? `h-0.75 w-6 ${entry.className ?? ""}`
                        : `size-2.5 rounded-full border-2 border-background ${entry.className ?? ""}`
                  }
                  style={entry.style}
               />
               {entry.label}
            </span>
         ))}
      </div>
   );
}
