import { Languages, Cog, DraftingCompass, Sparkles, BadgeCheck, UserRound, Apple, Dumbbell, House, BicepsFlexed, Package2, Pill, HeartPlus, LogIn } from "@lucide/vue";
import type { tSelect, tSelectOpt, tNavigationItem, tSwitcherHorizontal, tInputHorizontal, tMealAssetSaved, tMealAssetUnsaved, tMealAssetGroup, tMealTableItem } from "../appSettings/types";
// 
import { useMealAssetSavedStore } from "../stores/useMealAssetSavedStore";
import { useMealAssetGroupStore } from "../stores/useMealAssetGroupStore";
// date
export const today = new Date().toISOString().split("T")[0];
export const dateToISO = (dateString: string): string | undefined => {
  if (!dateString) return undefined;
  if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) return dateString.split("T")[0];
  if (dateString.includes(".")) {
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`;
  }
  if (dateString.includes("-")) {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  }
  return dateString;
};
export const dateFromISO = (dateString: string): string => {
  if (!dateString) return "";
  if (dateString.includes(".") && !dateString.includes("-")) return dateString;
  if (dateString.includes("-") && dateString.match(/^\d{2}-\d{2}-\d{4}/)) {
    const [day, month, year] = dateString.split("-");
    return `${day}.${month}.${year}`;
  }
  let cleanDate = dateString;
  if (dateString.includes("T")) {
    const datePart = dateString.split("T")[0];
    if (datePart) cleanDate = datePart;
  }
  const parts = cleanDate.split("-");
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  return `${day}.${month}.${year}`;
};
// navigation
export const authNavigationArray: tNavigationItem[] = [
  { index: 0, title: "sett", svg: Cog },
  { index: 0, title: "body", svg: DraftingCompass },
  { index: 0, title: "goal", svg: Sparkles },
  { index: 0, title: "macro", svg: Apple },
];
for (let i = 1; i < authNavigationArray.length; i++) {
  authNavigationArray[i]!.index = i;
}
export const authNavigationItem: tNavigationItem = { index: 0, title: "account", svg: UserRound };
export const dashboardNavigationArray: tNavigationItem[] = [
  { index: 0, title: "home", svg: House },
  { index: 0, title: "meal", svg: Apple },
  { index: 0, title: "sport", svg: BicepsFlexed },
  { index: 0, title: "meds", svg: Pill },
];
for (let i = 1; i < dashboardNavigationArray.length; i++) {
  dashboardNavigationArray[i]!.index = i;
}
export const dashboardNavigationItem: tNavigationItem = { index: 0, title: "account", svg: UserRound };
export const subNavigationArray: any = [
  ["meal", "sport", "meds", "thing"],
  ["history", "intake", "new"],
  ["log", "activity", "exercises", "thing"],
  ["log", "vitamins", "vitamin list", "thing"],
];
// select vertical
const languageOpt: tSelectOpt[] = [
  { title: "english", worth: "en" },
  { title: "russian", worth: "ru" },
  { title: "espaniol", worth: "es" },
  { title: "mandarin", worth: "zh" },
];
export const languageSelect: tSelect = {
  title: "language",
  data: {
    dataType: "string",
    start: 0,
    opt: languageOpt,
  },
  st: {},
};
const fontSizeSwitcherOpt: tSelectOpt[] = [
  { title: "verySmall", worth: 0.8 },
  { title: "small", worth: 0.9 },
  { title: "medium", worth: 1.0 },
  { title: "big", worth: 1.1 },
  { title: "large", worth: 1.2 },
];
export const fontSizeSwitcher: tSelect = {
  title: "fontSize",
  desc: "recomendedFont",
  data: {
    dataType: "number",
    start: 2,
    opt: fontSizeSwitcherOpt,
  },
  st: {},
};
const activityOpt: tSelectOpt[] = [
  { title: "notToCount", worth: 1.0 },
  { title: "activityLevel1", worth: 1.05 },
  { title: "activityLevel2", worth: 1.2 },
  { title: "activityLevel3", worth: 1.35 },
  { title: "activityLevel4", worth: 1.5 },
  { title: "activityLevel5", worth: 1.65 },
  { title: "activityLevel6", worth: 1.8 },
];
export const activitySelect: tSelect = {
  title: "activity",
  data: {
    dataType: "number",
    start: 1,
    opt: activityOpt,
  },
  st: {},
};
// select vertical
const genderOpt: tSelectOpt[] = [
  { title: "male", worth: "male" },
  { title: "female", worth: "female" },
];
export const genderSelect: tSelect = {
  title: "gender",
  data: {
    dataType: "string",
    start: 1,
    opt: genderOpt,
  },
  st: {},
};
const signOpt: tSelectOpt[] = [
  { title: "signUp", worth: "signUp" },
  { title: "signIn", worth: "signIn" },
];
export const signSelect: tSelect = {
  title: "account",
  data: {
    dataType: "string",
    start: 0,
    opt: signOpt,
  },
  st: {},
};
const mealAssetOpt: tSelectOpt[] = [
  { title: "single", worth: "single" },
  { title: "group", worth: "group" },
];
export const mealAsset: tSelect = {
  title: "meal",
  data: {
    dataType: "string",
    start: 0,
    opt: mealAssetOpt,
  },
  st: {},
};
// switcher horizontal
export const themeSwitcher: tSwitcherHorizontal = {
  title: "darkMode",
  data: {
    dataType: "text",
    start: false,
    on: "dark",
    off: "light",
  },
  st: {},
};
export const recalcSwitcher: tSwitcherHorizontal = {
  title: "recalc",
  data: {
    dataType: "text",
    start: true,
    on: "full",
    off: "recalc",
  },
  st: {
    fontSize: 's'
  },
};
// input horizontal
export const weightInput: tInputHorizontal = {
  title: "weight",
  desc: "weight",
  data: {
    dataType: "number",
    start: undefined,
    placeholder: "weight",
  },
  rule: {
    number: {
      minValue: 30,
      maxValue: 150,
    },
  },
  st: {},
};
export const mealNameInput: tInputHorizontal = {
  title: "mealName",
  data: {
    dataType: "string",
    start: undefined,
    placeholder: "mealName",
  },
  rule: {
    string: {
      minLength: 2,
      maxLength: 24,
      toContain: [],
      noToContain: ["@", "#", "$", "%"],
    },
  },
  st: {},
};
export const weightMiniInput: tInputHorizontal = {
  title: "weight",
  desc: "weight",
  data: {
    dataType: "number",
    start: undefined,
    placeholder: "weight",
  },
  rule: {
    number: {
      minValue: 3,
      maxValue: 1000,
    },
  },
  st: {},
};
export const bfInput: tInputHorizontal = {
  title: "bodyFat",
  desc: "bodyFat",
  data: {
    dataType: "number",
    start: undefined,
    placeholder: "bodyFat",
  },
  rule: {
    number: {
      minValue: 3,
      maxValue: 50,
    },
  },
  st: {},
};
export const heightInput: tInputHorizontal = {
  title: "height",
  desc: "height",
  data: {
    dataType: "number",
    start: undefined,
    placeholder: "height",
  },
  rule: {
    number: {
      minValue: 120,
      maxValue: 250,
    },
  },
  st: {},
};
export const ageInput: tInputHorizontal = {
  title: "age",
  desc: "age",
  data: {
    dataType: "number",
    start: undefined,
    placeholder: "age",
  },
  rule: {
    number: {
      minValue: 14,
      maxValue: 99,
    },
  },
  st: {},
};
export const caloriesInput: tInputHorizontal = {
  title: "calories",
  data: {
    dataType: "number",
    start: undefined,
    placeholder: "calories",
  },
  rule: {
    number: {
      minValue: 1200,
      maxValue: 5000,
    },
  },
  st: {},
};
export const proteinsInput: tInputHorizontal = {
  title: "proteins",
  data: {
    dataType: "number",
    start: undefined,
    placeholder: "proteins",
  },
  rule: {
    number: {
      minValue: 30,
      maxValue: 300,
    },
  },
  st: {},
};
export const carbsInput: tInputHorizontal = {
  title: "carbs",
  data: {
    dataType: "number",
    start: undefined,
    placeholder: "carbs",
  },
  rule: {
    number: {
      minValue: 60,
      maxValue: 600,
    },
  },
  st: {},
};
export const fatsInput: tInputHorizontal = {
  title: "fats",
  data: {
    dataType: "number",
    start: undefined,
    placeholder: "fats",
  },
  rule: {
    number: {
      minValue: 10,
      maxValue: 200,
    },
  },
  st: {},
};
export const usernameInput: tInputHorizontal = {
  title: "username",
  data: {
    dataType: "string",
    start: undefined,
    placeholder: "username",
  },
  rule: {
    string: {
      minLength: 6,
      maxLength: 16,
      toContain: [],
      noToContain: ["@", "#", "$", "%"],
      stringPattern: /^[a-zA-Z][a-zA-Z0-9_ ]*$/,
    },
  },
  st: {},
};
export const emailInput: tInputHorizontal = {
  title: "email",
  data: {
    dataType: "string",
    start: undefined,
    placeholder: "email",
  },
  rule: {
    string: {
      minLength: 6,
      maxLength: 32,
      toContain: ["@", "."],
      noToContain: [" "],
      stringPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  st: {},
};
export const passwordInput: tInputHorizontal = {
  title: "password",
  data: {
    dataType: "password",
    start: undefined,
    placeholder: "password",
  },
  rule: {
    string: {
      minLength: 6,
      maxLength: 20,
      toContain: [],
      noToContain: [" "],
      stringPattern: /^[a-zA-Z0-9!]+$/,
    },
  },
  st: {},
};
// MACRO CALCULATION
import type { tBody, tMacro, tGoalWeightBoadyFat } from "../appSettings/types";
export const calculateMacros = (body: tBody, goals: tGoalWeightBoadyFat): tMacro => {
  // 1. Расчет BMR (базальный метаболизм) по формуле Миффлина-Сан Жеора
  let bmr: number;
  if (body.gender === "male") bmr = 10 * body.weight! + 6.25 * body.height! - 5 * body.age! + 5;
  else bmr = 10 * body.weight! + 6.25 * body.height! - 5 * body.age! - 161;
  // 2. TDEE (общий расход энергии)
  const tdee = bmr * body.activity!;
  // 3. Корректировка калорий в зависимости от цели
  let calorieAdjustment = 0;
  const weightDiff = goals.weight - body.weight!;
  // Для похудения/набора: ~500 калорий на 0.5 кг в неделю
  if (Math.abs(weightDiff) > 0.5) {
    calorieAdjustment = weightDiff * 1000;
    calorieAdjustment = Math.min(Math.max(calorieAdjustment, -500), 500);
  }
  const targetCalories = Math.round(tdee + calorieAdjustment);
  // 4. Расчет белков (2.2 г на кг целевого веса)
  const proteins = Math.round(goals.weight * 2.2);
  // 5. Расчет жиров (0.8-1 г на кг целевого веса, в зависимости от % жира)
  let fatMultiplier = 0.9;
  if (goals.bodyFat < 15) fatMultiplier = 0.8;
  if (goals.bodyFat > 25) fatMultiplier = 1.0;
  const fats = Math.round(goals.weight * fatMultiplier);
  // 6. Расчет углеводов (оставшиеся калории)
  const caloriesFromProteins = proteins * 4;
  const caloriesFromFats = fats * 9;
  let carbs = Math.round((targetCalories - caloriesFromProteins - caloriesFromFats) / 4);
  // Корректировка минимальных значений
  carbs = Math.max(carbs, 50);
  return { calories: targetCalories, proteins, fats, carbs };
};
export const getRandomAvatarIndex = (): number => {
  return Math.floor(Math.random() * 27);
};
// stats calculation
const mealFiller : tMealAssetUnsaved = {
  name: 'deleted',
  weight: 0,
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
}
export const getMealByTd = (data: string | number) : tMealAssetSaved | tMealAssetGroup | tMealAssetUnsaved | undefined => {
  const mealAssetSaved = useMealAssetSavedStore();
  const foundA = mealAssetSaved.saved.find((item: any) => item.id === data);
  if (foundA) return foundA
  const mealAssetGroup = useMealAssetGroupStore();
  const foundB = mealAssetGroup.groups.find((item: any) => item.id === data);
  if (foundB) return foundB
  if (!foundA && !foundB) return mealFiller
}
export const getWeight = (data: any) => {
  const mealAssetSaved = useMealAssetSavedStore();
  if (!data.list) {
    return data.weight || 0;
  } else {
    let weight = 0;
    for (let i = 0; i < data.list.length; i++) {
      const productId = data.list[i];
      const product = mealAssetSaved.saved.find((item: any) => item.id === productId);
      if (product && product.weight) weight += product.weight;
    }
    return weight;
  }
};
export const getCalories = (data: any) => {
  const mealAssetSaved = useMealAssetSavedStore();
  if (!data.list) {
    return data.calories || 0;
  } else {
    let total = 0;
    for (let i = 0; i < data.list.length; i++) {
      const productId = data.list[i];
      const product = mealAssetSaved.saved.find((item: any) => item.id === productId);
      if (product && product.calories) total += product.calories;
    }
    return total;
  }
};
export const getProteins = (data: any) => {
  const mealAssetSaved = useMealAssetSavedStore();
  if (!data.list) {
    return data.proteins || 0;
  } else {
    let total = 0;
    for (let i = 0; i < data.list.length; i++) {
      const productId = data.list[i];
      const product = mealAssetSaved.saved.find((item: any) => item.id === productId);
      if (product && product.proteins) total += product.proteins;
    }
    return total;
  }
};
export const getFats = (data: any) => {
  const mealAssetSaved = useMealAssetSavedStore(); 
  if (!data.list) {
    return data.fats || 0;
  } else {
    let total = 0;
    for (let i = 0; i < data.list.length; i++) {
      const productId = data.list[i];
      const product = mealAssetSaved.saved.find((item: any) => item.id === productId);
      if (product && product.fats) total += product.fats;
    }
    return total;
  }
};
export const getCarbs = (data: any) => {
  const mealAssetSaved = useMealAssetSavedStore();
  if (!data.list) {
    return data.carbs || 0;
  } else {
    let total = 0;
    for (let i = 0; i < data.list.length; i++) {
      const productId = data.list[i];
      const product = mealAssetSaved.saved.find((item: any) => item.id === productId);
      if (product && product.carbs) total += product.carbs;
    }
    return total;
  }
};