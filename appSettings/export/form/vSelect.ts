import type { tSelectOpt, tSelect } from "../types/form";
const languageOpt: tSelectOpt[] = [
  { title: "english", worth: "en" },
  { title: "russian", worth: "ru" },
  { title: "espaniol", worth: "es" },
  { title: "mandarin", worth: "zh" },
];
export const language: tSelect = {
  title: "language",
  data: {
    dataType: "string",
    opt: languageOpt,
  },
};
const fontSizeOpt: tSelectOpt[] = [
  { title: "verySmall", worth: 0.8 },
  { title: "small", worth: 0.9 },
  { title: "medium", worth: 1.0 },
  { title: "big", worth: 1.1 },
  { title: "large", worth: 1.2 },
];
export const fontSize: tSelect = {
  title: "fontSize",
  desc: "recomendedFont",
  data: {
    dataType: "number",
    opt: fontSizeOpt,
  },
};
const activityOpt: tSelectOpt[] = [
  { title: "activityLevel1", worth: 1.05 },
  { title: "activityLevel2", worth: 1.2 },
  { title: "activityLevel3", worth: 1.35 },
  { title: "activityLevel4", worth: 1.5 },
  { title: "activityLevel5", worth: 1.65 },
  { title: "activityLevel6", worth: 1.8 },
];
export const activity: tSelect = {
  title: "activity",
  data: {
    dataType: "number",
    opt: activityOpt,
  },
};
const mealModeOpt: tSelectOpt[] = [
  { title: "basket", worth: "basket" },
  { title: "products", worth: "products" },
  { title: "meals", worth: "meals" },
  { title: "unsaved", worth: "unsaved" },
];
export const mealMode: tSelect = {
  data: {
    dataType: "string",
    opt: mealModeOpt,
  },
};
const intakeTypeOpt: tSelectOpt[] = [
  { title: "breakfast", worth: "breakfast" },
  { title: "lunch", worth: "lunch" },
  { title: "supper", worth: "supper" },
  { title: "dinner", worth: "dinner" },
  { title: "snack", worth: "snack" },
];
export const intakeType: tSelect = {
  title: "intakeTime",
  data: {
    dataType: "string",
    opt: intakeTypeOpt,
  },
};
