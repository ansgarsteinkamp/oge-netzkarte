const TOOLTIP_OFFSET = 10;

const createElement = (tag, className, text) => {
   const element = document.createElement(tag);
   if (className) element.className = className;
   if (text !== undefined) element.textContent = text;
   return element;
};

export const createMapTooltip = ({ rows, subtitle, symbol, title }) => {
   const symbolElement = createElement("span", `map-tooltip-symbol map-tooltip-symbol-${symbol.kind}`);
   symbolElement.style.background = symbol.background;
   symbolElement.setAttribute("aria-hidden", "true");

   const titles = createElement("div", "map-tooltip-titles");
   titles.append(createElement("strong", "map-tooltip-title", title));
   if (subtitle) titles.append(createElement("span", "map-tooltip-subtitle", subtitle));

   const header = createElement("div", "map-tooltip-header");
   header.append(symbolElement, titles);

   const list = createElement("dl", "map-tooltip-rows");
   rows.forEach(({ label, value }) => list.append(createElement("dt", null, label), createElement("dd", null, value)));

   const body = createElement("div", "map-tooltip-body");
   body.append(header, list);
   return body;
};

// Open below the anchor in the upper half of the map so tall tooltips are not cut off at the top edge.
export const getTooltipPlacement = (containerY, mapHeight) =>
   containerY < mapHeight / 2
      ? { direction: "bottom", offset: [0, TOOLTIP_OFFSET] }
      : { direction: "top", offset: [0, -TOOLTIP_OFFSET] };
