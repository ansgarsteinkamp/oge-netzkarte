export const RELATION_LABELS = {
   direct_operator: "OGE direkt",
   joint_operator: "Gemeinsam",
   joint_venture: "OGE-Beteiligung",
   oge_owned_affiliate: "OGE-Beteiligung"
};

export const OGE_PARTICIPATION_RELATION_TYPES = ["joint_venture", "oge_owned_affiliate"];

export const RELATION_FILTERS = [
   { value: "direct_operator", label: RELATION_LABELS.direct_operator, relationTypes: ["direct_operator"] },
   { value: "joint_operator", label: RELATION_LABELS.joint_operator, relationTypes: ["joint_operator"] },
   { value: "oge_participation", label: RELATION_LABELS.joint_venture, relationTypes: OGE_PARTICIPATION_RELATION_TYPES }
];

export const POINT_TYPE_ORDER = ["NKP-GÜ", "NKP-MAP", "Speicher", "LNG"];
export const GAS_TYPE_ORDER = ["H-Gas", "L-Gas"];
export const DEFAULT_GAS_TYPE = "H-Gas";
export const MAIN_DIRECTION_ORDER = ["Einspeisung", "Ausspeisung", null];
export const VALID_PIPELINE_GAS_QUALITIES = new Set(["H-Gas", "unbekannt / L-Gas-nahe Rohdatenkodierung"]);

export const GERMANY_ID = "276";
export const ALL_VALUE = "all";
