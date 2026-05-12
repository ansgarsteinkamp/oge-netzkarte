export default function Topbar() {
   return (
      <section className="mx-auto mb-3.5 flex max-w-[1700px] items-end justify-between gap-6 max-[1180px]:flex-col max-[1180px]:items-stretch">
         <div>
            <p className="mb-1.5 text-[0.72rem] font-medium text-primary uppercase">Marktgebiet THE</p>
            <h1 className="mb-0 text-[clamp(1.1rem,1.45vw,1.55rem)] leading-[1.15] font-medium text-card-foreground">Vereinfachte OGE-Netzkarte für die Disposition</h1>
         </div>
      </section>
   );
}
