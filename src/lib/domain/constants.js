export const RELATION_LABELS = {
   operator: "OGE direkt",
   joint_operator: "Gemeinschaftsleitung",
   co_owned_affiliate: "OGE-Beteiligung mit Partnern",
   owned_affiliate: "OGE-Alleinbeteiligung"
};

export const RELATION_FILTER_LABELS = {
   operator: "OGE direkt",
   joint_operator: "Gemeinschaft",
   co_owned_affiliate: "Mit Partnern",
   owned_affiliate: "OGE allein"
};

const RELATION_DESCRIPTIONS = {
   operator: "Leitungen, die OGE\nselbst betreibt",
   joint_operator: "Gemeinschaftsleitungen\nmit OGE als Betreiber",
   co_owned_affiliate: "OGE-Beteiligungen\nmit weiteren Partnern",
   owned_affiliate: "Vollständig der OGE\nzugeordnete Beteiligungen"
};

export const RELATION_DETAIL_DESCRIPTIONS = {
   operator: "Leitung, die OGE selbst betreibt",
   joint_operator: "Gemeinschaftsleitung mit OGE als Betreiber",
   co_owned_affiliate: "OGE-Beteiligung mit weiteren Partnern",
   owned_affiliate: "Vollständig der OGE zugeordnete Beteiligung"
};

export const OGE_AFFILIATE_ROLES = ["co_owned_affiliate", "owned_affiliate"];

export const RELATION_FILTERS = [
   { value: "operator", label: RELATION_FILTER_LABELS.operator, description: RELATION_DESCRIPTIONS.operator, relationTypes: ["operator"] },
   { value: "joint_operator", label: RELATION_FILTER_LABELS.joint_operator, description: RELATION_DESCRIPTIONS.joint_operator, relationTypes: ["joint_operator"] },
   { value: "co_owned_affiliate", label: RELATION_FILTER_LABELS.co_owned_affiliate, description: RELATION_DESCRIPTIONS.co_owned_affiliate, relationTypes: ["co_owned_affiliate"] },
   { value: "owned_affiliate", label: RELATION_FILTER_LABELS.owned_affiliate, description: RELATION_DESCRIPTIONS.owned_affiliate, relationTypes: ["owned_affiliate"] }
];

export const POINT_TYPE_ORDER = ["NKP-GÜ", "NKP-MAP", "Speicher", "LNG"];
export const GAS_TYPE_ORDER = ["H-Gas", "L-Gas"];
export const DEFAULT_GAS_TYPE = "H-Gas";
export const MAIN_DIRECTION_ORDER = ["Einspeisung", "Ausspeisung", null];
export const PIPELINE_GAS_LABELS = {
   h_gas: "H-Gas",
   l_gas: "L-Gas"
};
export const PIPELINE_GAS_FILTER_VALUES = {
   h_gas: "H-Gas",
   l_gas: "L-Gas"
};
export const PIPELINE_STATUS_LABELS = {
   operating: "In Betrieb",
   under_construction: "Im Bau",
   approved: "Genehmigt"
};
export const VALID_PIPELINE_GAS_QUALITIES = new Set(Object.keys(PIPELINE_GAS_LABELS));
export const VALID_PIPELINE_STATUSES = new Set(Object.keys(PIPELINE_STATUS_LABELS));

export const GERMANY_ID = "276";
export const ALL_VALUE = "all";
