import type { tInputNumber } from "../types/form";

// body
export const bodyWeight: tInputNumber = {
  title: "weight",
  desc: "weight",
  data: {
    dataType: "number",
    placeholder: "weight",
  },
  rule: {
    minValue: 30,
    maxValue: 150,
  },
};

export const bodyFat: tInputNumber = {
  title: "bodyFat",
  desc: "bodyFat",
  data: {
    dataType: "number",
    placeholder: "bodyFat",
  },
  rule: {
    minValue: 3,
    maxValue: 50,
  },
};

export const height: tInputNumber = {
  title: "height",
  desc: "height",
  data: {
    dataType: "number",
    placeholder: "height",
  },
  rule: {
    minValue: 120,
    maxValue: 250,
  },
};

export const age: tInputNumber = {
  title: "age",
  desc: "age",
  data: {
    dataType: "number",
    placeholder: "age",
  },
  rule: {
    minValue: 14,
    maxValue: 99,
  },
};

// macro
export const calories: tInputNumber = {
  title: "calories",
  data: {
    dataType: "number",
    placeholder: "calories",
  },
  rule: {
    minValue: 1200,
    maxValue: 5000,
  },
};

export const proteins: tInputNumber = {
  title: "proteins",
  data: {
    dataType: "number",
    placeholder: "proteins",
  },
  rule: {
    minValue: 30,
    maxValue: 300,
  },
};

export const carbs: tInputNumber = {
  title: "carbs",
  data: {
    dataType: "number",
    placeholder: "carbs",
  },
  rule: {
    minValue: 60,
    maxValue: 600,
  },
};

export const fats: tInputNumber = {
  title: "fats",
  data: {
    dataType: "number",
    placeholder: "fats",
  },
  rule: {
    minValue: 10,
    maxValue: 200,
  },
};

// meal (числовые)
export const mealWeight: tInputNumber = {
  data: {
    dataType: "number",
    placeholder: "per100g",
  },
  rule: {
    minValue: 1,
    maxValue: 5000,
  },
};

export const mealCalories: tInputNumber = {
  data: {
    dataType: "number",
    placeholder: "calories",
  },
  rule: {
    minValue: 0,
    maxValue: 5000,
  },
};

export const mealProteins: tInputNumber = {
  data: {
    dataType: "number",
    placeholder: "proteins",
  },
  rule: {
    minValue: 0,
    maxValue: 1000,
  },
};

export const mealCarbs: tInputNumber = {
  data: {
    dataType: "number",
    placeholder: "carbs",
  },
  rule: {
    minValue: 0,
    maxValue: 1000,
  },
};

export const mealFats: tInputNumber = {
  data: {
    dataType: "number",
    placeholder: "fats",
  },
  rule: {
    minValue: 0,
    maxValue: 1000,
  },
};
export const sets: tInputNumber = {
  data: {
    dataType: "number",
    placeholder: "sets",
  },
  rule: {
    minValue: 1,
    maxValue: 1000,
  },
};
export const reps: tInputNumber = {
  data: {
    dataType: "number",
    placeholder: "reps",
  },
  rule: {
    minValue: 1,
    maxValue: 1000,
  },
};
export const exWeight: tInputNumber = {
  data: {
    dataType: "number",
    placeholder: "weight",
  },
  rule: {
    minValue: 0.1,
    maxValue: 1000,
  },
};

export const scv: tInputNumber = {
  data: {
    dataType: "number",
    placeholder: "oncePerDays",
  },
  rule: {
    minValue: 1,
    maxValue: 365,
  },
};
