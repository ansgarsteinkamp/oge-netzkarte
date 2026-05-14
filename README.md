# OGE-Netzkarte

Vereinfachte interaktive OGE-Netzkarte für die Disposition auf Basis öffentlich verfügbarer Daten.

## Start

```bash
pnpm install
pnpm dev
```

## Befehle

```bash
pnpm validate:data
pnpm build
pnpm preview
```

`pnpm build` führt zuerst die Datenvalidierung aus und baut danach die Vite-App. Die CI nutzt denselben Befehl.

## Struktur

- `src/components/map/`: Leaflet-Viewport, Layer, Kameraeffekte und Legende
- `src/components/panels/`: Filter-, Auswahl- und Datenhinweispanels
- `src/hooks/`: Datenladen, Filterzustand und Auswahlzustand
- `src/lib/domain/`: Domain-Konstanten, Filter, Formatter, Suche und Facetten
- `src/lib/data/`: Datenladen und GeoJSON-Sammlungen
- `src/lib/map/`: Kartenstyles, Bounds und Marker-Offsets

## Deployment

Die Vite-Konfiguration nutzt bewusst `base: "./"`, damit gebaute Assets auch unter GitHub-Pages- oder anderen Subpath-Deployments portabel bleiben.
