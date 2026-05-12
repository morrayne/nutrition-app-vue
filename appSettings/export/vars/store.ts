import { ref } from "vue";

import type { tSignTable, tBodyTable, tCommonTable } from "../types/store";
export const vSignTable = ref<tSignTable>({
  email: undefined,
  password: undefined,
});
export const vBodyTable = ref<tBodyTable>({
  age: undefined,
  height: undefined,
  gender: "male",
  activity: 1.2,
  weightNow: undefined,
  bodyFatNow: undefined,
  calories: undefined,
  proteins: undefined,
  fats: undefined,
  carbs: undefined,
  weightGoal: undefined,
  bodyFatGoal: undefined,
});
export const vCommonTable = ref<tCommonTable>({
  username: undefined,
  email: undefined,
  icon: 0,
  language: "en",
  theme: "dark",
  fontSize: 1,
  focusColor: "#a29bfe",
});
