import type { tInputString } from "../../export/types/form";

// user (строковые)
export const username: tInputString = {
  title: "username",
  data: {
    dataType: "string",
    placeholder: "username",
  },
  rule: {
    minLength: 4,
    maxLength: 16,
    toContain: [],
    noToContain: ["@", "#", "$", "%"],
    stringPattern: /^[a-zA-Z][a-zA-Z0-9_ ]*$/,
  },
};

export const email: tInputString = {
  title: "email",
  data: {
    dataType: "string",
    placeholder: "email",
  },
  rule: {
    minLength: 6,
    maxLength: 32,
    toContain: ["@", "."],
    noToContain: [" "],
    stringPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};

export const password: tInputString = {
  title: "password",
  data: {
    dataType: "password",
    placeholder: "password",
  },
  rule: {
    minLength: 6,
    maxLength: 20,
    toContain: [],
    noToContain: [" "],
    stringPattern: /^[a-zA-Z0-9!]+$/,
  },
};

// meal (строковые)
export const mealName: tInputString = {
  data: {
    dataType: "string",
    placeholder: "mealName",
  },
  rule: {
    minLength: 2,
    maxLength: 24,
    toContain: [],
    noToContain: ["@", "#"],
  },
};
