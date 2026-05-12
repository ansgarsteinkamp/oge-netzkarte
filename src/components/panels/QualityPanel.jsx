export default function QualityPanel() {
   return (
      <aside className="relative flex-none border border-border bg-muted/75 p-4 text-xs leading-relaxed text-muted-foreground" aria-labelledby="quality-panel-title">
         <div className="grid gap-1 pr-8">
            <p className="m-0 text-[0.72rem] font-medium text-primary uppercase">Datenbasis</p>
            <h2 id="quality-panel-title" className="m-0 text-base leading-snug font-medium text-card-foreground">Öffentliche Daten</h2>
         </div>
         <div className="mt-3 grid gap-2">
            <p className="m-0">Die dargestellten Leitungen und Punkte wurden aus öffentlich zugänglichen Informationen zusammengestellt und vereinfacht aufbereitet.</p>
            <p className="m-0">Diese Karte dient der Orientierung und ersetzt keine offizielle Leitungsauskunft oder ein Anlagenregister der OGE.</p>
         </div>
      </aside>
   );
}
