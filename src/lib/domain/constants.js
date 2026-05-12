export const RELATION_LABELS = {
   direct_operator: "OGE direkt",
   joint_operator: "Gemeinsam",
   joint_venture: "OGE-Beteiligung",
   oge_owned_affiliate: "OGE-Beteiligung"
};

export const RELATION_FILTERS = [
   { value: "direct_operator", label: RELATION_LABELS.direct_operator, relationTypes: ["direct_operator"] },
   { value: "joint_operator", label: RELATION_LABELS.joint_operator, relationTypes: ["joint_operator"] },
   { value: "oge_participation", label: "OGE-Beteiligung", relationTypes: ["joint_venture", "oge_owned_affiliate"] }
];

export const POINT_TYPE_ORDER = ["NKP-GÜ", "NKP-MAP", "Speicher", "LNG"];
export const GAS_TYPE_ORDER = ["H-Gas", "L-Gas"];
export const MAIN_DIRECTION_ORDER = ["Einspeisung", "Ausspeisung", null];
export const ROUTE_GROUP_ORDER = [
   "deudan",
   "joint_operator_unclassified",
   "megal",
   "metg",
   "netg",
   "netra",
   "oge_direct_unclassified",
   "tenp",
   "wal",
   "zeelink"
];
export const VALID_PIPELINE_GAS_QUALITIES = new Set(["H-Gas", "unbekannt / L-Gas-nahe Rohdatenkodierung"]);

export const EUROPE_CONTEXT_IDS = new Set([
   "008",
   "040",
   "056",
   "070",
   "100",
   "112",
   "191",
   "203",
   "208",
   "233",
   "246",
   "250",
   "300",
   "348",
   "372",
   "380",
   "428",
   "440",
   "442",
   "498",
   "499",
   "528",
   "578",
   "616",
   "620",
   "642",
   "688",
   "703",
   "705",
   "724",
   "752",
   "756",
   "792",
   "804",
   "807",
   "826"
]);

export const GERMANY_ID = "276";
export const ALL_VALUE = "all";
