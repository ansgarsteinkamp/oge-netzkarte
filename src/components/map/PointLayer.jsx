import { useCallback, useEffect, useRef, useState } from "react";
import { CircleMarker, Pane, Tooltip, useMap } from "react-leaflet";

import { toLatLng } from "@/lib/domain/coordinates";
import { getPointPathOptions, getPointRadius, shouldRenderTechnicalPoints } from "@/lib/map/pointMarkers";

function InteractiveCircleMarker({ ariaLabel, center, dataAttributes = {}, onActivate, pathOptions, radius, tooltip }) {
   const markerElementRef = useRef(null);
   const activateRef = useRef(onActivate);

   useEffect(() => {
      activateRef.current = onActivate;
   }, [onActivate]);

   const activateFromKeyboard = useCallback(event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      activateRef.current();
   }, []);

   const removeKeyboardListener = useCallback(() => {
      if (!markerElementRef.current) return;

      markerElementRef.current.removeEventListener("keydown", activateFromKeyboard);
      markerElementRef.current = null;
   }, [activateFromKeyboard]);

   const syncFocusability = useCallback(element => {
      const isVisible = element.getBBox().width > 0 && element.getBBox().height > 0;
      element.setAttribute("aria-hidden", isVisible ? "false" : "true");
      element.setAttribute("tabindex", isVisible ? "0" : "-1");
   }, []);

   return (
      <CircleMarker
         center={center}
         radius={radius}
         pathOptions={pathOptions}
         eventHandlers={{
            add: event => {
               const element = event.target.getElement();
               if (element) {
                  removeKeyboardListener();
                  markerElementRef.current = element;
                  element.setAttribute("aria-label", ariaLabel);
                  element.setAttribute("role", "button");
                  Object.entries(dataAttributes).forEach(([name, value]) => element.setAttribute(name, value));
                  syncFocusability(element);
                  element.addEventListener("keydown", activateFromKeyboard);
               }
            },
            click: onActivate,
            remove: removeKeyboardListener
         }}
      >
         <Tooltip className="map-tooltip" direction="top" offset={[0, -6]} pane="tooltipPane">
            <strong>{tooltip}</strong>
         </Tooltip>
      </CircleMarker>
   );
}

function TechnicalPointMarker({ cluster, onSelectPoint, point }) {
   return (
      <InteractiveCircleMarker
         ariaLabel={`Details zu technischem Punkt ${point.label} öffnen`}
         center={toLatLng(point)}
         dataAttributes={{ "data-cluster-id": cluster.id, "data-technical-point-id": point.location_id }}
         onActivate={() => onSelectPoint(cluster, point)}
         pathOptions={getPointPathOptions(cluster, 0.92)}
         radius={getPointRadius(cluster.importance_level)}
         tooltip={point.label}
      />
   );
}

function PointMarker({ onSelectPoint, point }) {
   return (
      <InteractiveCircleMarker
         ariaLabel={`Punkt ${point.name} auswählen`}
         center={toLatLng(point)}
         dataAttributes={{ "data-point-id": point.id }}
         onActivate={() => onSelectPoint(point)}
         pathOptions={getPointPathOptions(point)}
         radius={getPointRadius(point.importance_level)}
         tooltip={point.name}
      />
   );
}

function PointOrTechnicalMarkers({ map, onSelectPoint, point }) {
   if (shouldRenderTechnicalPoints(point, map)) {
      return point.points.map(technicalPoint => (
         <TechnicalPointMarker
            key={`${point.id}-${technicalPoint.location_id}`}
            cluster={point}
            point={technicalPoint}
            onSelectPoint={onSelectPoint}
         />
      ));
   }

   return <PointMarker point={point} onSelectPoint={onSelectPoint} />;
}

export default function PointLayer({ onSelectPoint, points, visible }) {
   const map = useMap();
   const [mapRevision, setMapRevision] = useState(0);

   useEffect(() => {
      const syncMapRevision = () => setMapRevision(revision => revision + 1);

      syncMapRevision();
      map.on("moveend", syncMapRevision);
      map.on("zoomend", syncMapRevision);

      return () => {
         map.off("moveend", syncMapRevision);
         map.off("zoomend", syncMapRevision);
      };
   }, [map]);

   return (
      <Pane name="points" style={{ zIndex: 460 }}>
         {visible && points.map(point => (
            <PointOrTechnicalMarkers key={`${point.id}-${mapRevision}`} map={map} point={point} onSelectPoint={onSelectPoint} />
         ))}
      </Pane>
   );
}
