import { useEffect, useState } from "react";

import { loadMapData } from "@/lib/data/loadMapData";

const initialState = {
   countries: null,
   error: null,
   loading: true,
   pipelineCollection: null,
   points: []
};

export function useMapData() {
   const [state, setState] = useState(initialState);

   useEffect(() => {
      let cancelled = false;

      async function load() {
         try {
            const data = await loadMapData(import.meta.env.BASE_URL);

            if (!cancelled) {
               setState({ ...data, error: null, loading: false });
            }
         } catch (error) {
            if (!cancelled) {
               setState({ ...initialState, error, loading: false });
            }
         }
      }

      load();

      return () => {
         cancelled = true;
      };
   }, []);

   return state;
}
