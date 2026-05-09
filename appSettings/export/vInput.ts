import type { tInput } from "../types/form";
// body
export const bodyWeight: tInput = {
  title: "weight",
  desc: "weight",
  data: {
    dataType: "number",
    placeholder: "weight",
  },
  rule: {
    number: {
      minValue: 30,
      maxValue: 150,
    },
  },
};
export const bodyFat: tInput = {
  title: "bodyFat",
  desc: "bodyFat",
  data: {
    dataType: "number",
    placeholder: "bodyFat",
  },
  rule: {
    number: {
      minValue: 3,
      maxValue: 50,
    },
  },
};
export const height: tInput = {
  title: "height",
  desc: "height",
  data: {
    dataType: "number",
    placeholder: "height",
  },
  rule: {
    number: {
      minValue: 120,
      maxValue: 250,
    },
  },
};
export const age: tInput = {
  title: "age",
  desc: "age",
  data: {
    dataType: "number",
    placeholder: "age",
  },
  rule: {
    number: {
      minValue: 14,
      maxValue: 99,
    },
  },
};
// macro
export const calories: tInput = {
  title: "calories",
  data: {
    dataType: "number",
    placeholder: "calories",
  },
  rule: {
    number: {
      minValue: 1200,
      maxValue: 5000,
    },
  },
};
export const proteins: tInput = {
  title: "proteins",
  data: {
    dataType: "number",
    placeholder: "proteins",
  },
  rule: {
    number: {
      minValue: 30,
      maxValue: 300,
    },
  },
};
export const carbs: tInput = {
  title: "carbs",
  data: {
    dataType: "number",
    placeholder: "carbs",
  },
  rule: {
    number: {
      minValue: 60,
      maxValue: 600,
    },
  },
};
export const fats: tInput = {
  title: "fats",
  data: {
    dataType: "number",
    placeholder: "fats",
  },
  rule: {
    number: {
      minValue: 10,
      maxValue: 200,
    },
  },
};
// user
export const username: tInput = {
  title: "username",
  data: {
    dataType: "string",
    placeholder: "username",
  },
  rule: {
    string: {
      minLength: 4,
      maxLength: 16,
      toContain: [],
      noToContain: ["@", "#", "$", "%"],
      stringPattern: /^[a-zA-Z][a-zA-Z0-9_ ]*$/,
    },
  },
};
export const email: tInput = {
  title: "email",
  data: {
    dataType: "string",
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
};
export const password: tInput = {
  title: "password",
  data: {
    dataType: "password",
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
};
// meal
export const mealName: tInput = {
  data: {
    dataType: "string",
    placeholder: "mealName",
  },
  rule: {
    string: {
      minLength: 2,
      maxLength: 24,
      toContain: [],
      noToContain: ["@", "#"],
    },
  },
};
export const mealWeight: tInput = {
  data: {
    dataType: "number",
    placeholder: "per100g",
  },
  rule: {
    number: {
      minValue: 1,
      maxValue: 5000,
    },
  },
};
export const mealCalories: tInput = {
  data: {
    dataType: "number",
    placeholder: "calories",
  },
  rule: {
    number: {
      minValue: 0,
      maxValue: 5000,
    },
  },
};
export const mealProteins: tInput = {
  data: {
    dataType: "number",
    placeholder: "proteins",
  },
  rule: {
    number: {
      minValue: 0,
      maxValue: 1000,
    },
  },
};
export const mealCarbs: tInput = {
  data: {
    dataType: "number",
    placeholder: "carbs",
  },
  rule: {
    number: {
      minValue: 0,
      maxValue: 1000,
    },
  },
};
export const mealFats: tInput = {
  data: {
    dataType: "number",
    placeholder: "fats",
  },
  rule: {
    number: {
      minValue: 0,
      maxValue: 1000,
    },
  },
};