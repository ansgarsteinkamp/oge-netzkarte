export const THEME = {
   background: "#262624",
   foreground: "#c3c0b6",
   card: "#262624",
   cardForeground: "#faf9f5",
   popover: "#30302e",
   popoverForeground: "#e5e5e2",
   primary: "#d97757",
   primaryForeground: "#ffffff",
   secondary: "#faf9f5",
   secondaryForeground: "#30302e",
   muted: "#1b1b19",
   mutedForeground: "#b7b5a9",
   accent: "#1a1915",
   accentForeground: "#f5f4ee",
   destructive: "#ef4444",
   border: "#3e3e38"
};

export const RELATION_COLORS = {
   operator: THEME.primary,
   joint_operator: "#e5e5e2",
   co_owned_affiliate: "#86b7a7",
   owned_affiliate: "#d2a766"
};

export const POINT_COLORS = {
   "NKP-GÜ": "#d97757",
   "NKP-MAP": "#e5e5e2",
   Speicher: "#86b7a7",
   LNG: "#d2a766"
};

const PARTICIPATION_LINE_DASH = 7;
const PARTICIPATION_LINE_GAP = 5;

export const PARTICIPATION_LINE_PATTERN = {
   dash: PARTICIPATION_LINE_DASH,
   gap: PARTICIPATION_LINE_GAP,
   dashArray: `${PARTICIPATION_LINE_DASH} ${PARTICIPATION_LINE_GAP}`
};

export const COUNTRY_STYLES = {
   context: { color: "#74746a", weight: 1.1, fillColor: THEME.popover, fillOpacity: 0.84 },
   germany: { color: THEME.secondary, weight: 2.1, fillColor: "#22221f", fillOpacity: 0.9 }
};
