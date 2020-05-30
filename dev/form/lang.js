import {
    PROP_DIMENSION_M,
    PROP_DIMENSION_FT,
    PROP_DIMENSION_KG,
    PROP_DIMENSION_M2,
    PROP_DIMENSION_M3,
    PROP_DIMENSION_FT2,
    PROP_DIMENSION_FT3,
} from './form.props'

export const STR_DIALOG_TITLE = "Estimate Form";
export const STR_ADD_PRODUCT = "Add";
export const STR_TOTAL = "Total";
export const STR_GRANT_TOTAL = "Grand Total";

export const STR_HEADER = "Header goes here (or not, can be empty)";
export const STR_FOOTER = "Footer goes here (or not, can be empty)";

export const STR_DELETE = "Delete";
export const STR_DELETE_EXPLANATION = "Click here to remove this product from your quote";

export const STR_LOADING = "Loading...";
export const STR_PRODUCT = "Product";
export const STR_QUANTITY = "Quantity";
export const STR_QUANTITY_MIN = 1;
export const STR_QUANTITY_MAX = 99;
export const STR_NAME = "Name";
export const STR_WEIGHT = "Weight";
export const STR_LENGTH = "Length";
export const STR_WIDTH = "Width";
export const STR_AREA = "Area";
export const STR_MODEL = "Service";
export const STR_MODEL_EXPLANATION = "Level of service required";
export const STR_PRICE = "Price by";
export const STR_EXTRA = "Extra";
export const STR_EXTRAS_EXPLANATION = "Extra notes of care, special items, etc";
export const STR_EXTRAS = "Extras";
export const STR_MEASUREMENT = "Measurement";
export const STR_MEASUREMENT_EXPLANATION = "Please confirm the measurements of the item in question, either area or weight";

export const STR_MAGNITUDE = {
    [PROP_DIMENSION_M]: {text:"Length",unit:"m"},
    [PROP_DIMENSION_FT]: {text:"Length",unit:"ft"},
    [PROP_DIMENSION_KG]: {text:"Weight",unit:"kg"},
    [PROP_DIMENSION_M2]: {text:"Size",unit:"m",sup:"2"},
    [PROP_DIMENSION_M3]: {text:"Vol",unit:"m",sup:"3"},
    [PROP_DIMENSION_FT2]: {text:"Size",unit:"ft",sup:"2"},
    [PROP_DIMENSION_FT3]: {text:"Vol",unit:"ft",sup:"3"},
};
