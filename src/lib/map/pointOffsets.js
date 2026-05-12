export const buildPointOffsets = sourcePoints => {
   const groups = new Map();
   sourcePoints.forEach(point => {
      const key = `${point.longitude.toFixed(3)},${point.latitude.toFixed(3)}`;
      groups.set(key, [...(groups.get(key) ?? []), point.id]);
   });

   return new Map(
      sourcePoints.map(point => {
         const key = `${point.longitude.toFixed(3)},${point.latitude.toFixed(3)}`;
         const ids = groups.get(key) ?? [];
         if (ids.length === 1) return [point.id, [point.latitude, point.longitude]];

         const index = ids.indexOf(point.id);
         const angle = (Math.PI * 2 * index) / ids.length;
         const radius = 0.022;
         return [point.id, [point.latitude + Math.sin(angle) * radius, point.longitude + Math.cos(angle) * radius]];
      })
   );
};
