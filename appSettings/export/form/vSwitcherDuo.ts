import type { tSelectOpt, tSelect } from "../types/form";
const genderOpt: tSelectOpt[] = [
  { title: "male", worth: "male" },
  { title: "female", worth: "female" },
];
export const gender: tSelect = {
  title: "gender",
  data: {
    dataType: "string",
    opt: genderOpt,
  },
};
const themeOpt: tSelectOpt[] = [
  { title: "light", worth: "light" },
  { title: "dark", worth: "dark" },
];
export const theme: tSelect = {
  title: "theme",
  data: {
    dataType: "string",
    opt: themeOpt,
  },
};
const intakeBasketOpt: tSelectOpt[] = [
  { title: "basket", worth: "basket" },
  { title: "add", worth: "add" },
];
export const intakeBasket: tSelect = {
  data: {
    dataType: "string",
    opt: intakeBasketOpt,
  },
};
const intakeModeOpt: tSelectOpt[] = [
  { title: "products", worth: "products" },
  { title: "meals", worth: "meals" },
];
export const intakeMode: tSelect = {
  data: {
    dataType: "string",
    opt: intakeModeOpt,
  },
};
const mealOrProductsOpt: tSelectOpt[] = [
  { title: "newMeal", worth: "newMeal" },
  { title: "products", worth: "products" },
];
export const mealOrProducts: tSelect = {
  data: {
    dataType: "string",
    opt: mealOrProductsOpt,
  },
};
const viewOrAddOpt: tSelectOpt[] = [
  { title: "view", worth: "view" },
  { title: "add", worth: "add" },
];
export const viewOrAdd: tSelect = {
  data: {
    dataType: "string",
    opt: viewOrAddOpt,
  },
};
const medsOpt: tSelectOpt[] = [
  { title: "view", worth: "view" },
  { title: "edit", worth: "edit" },
];
export const meds: tSelect = {
  data: {
    dataType: "string",
    opt: medsOpt,
  },
};
