import type { Component } from "vue";
// navigation
export interface tNavigationItem {
  index: number;
  title: string;
  svg: Component;
}
// input horizontal
export interface tInputHorizontal {
  title: string;
  desc?: string;
  data: {
    dataType: "string" | "number" | "password";
    start?: string | number;
    placeholder?: string;
  };
  rule: {
    string?: {
      minLength: number;
      maxLength: number;
      toContain?: string[];
      noToContain?: string[];
      stringPattern?: RegExp;
    };
    number?: {
      minValue: number;
      maxValue: number;
    };
  };
  st: {
    fontSize?: "xs" | "s" | "m" | "l" | "xl";
    displayExternal?: "weight-kg" | "height-cm";
  };
}
// select horizontal
export interface tSelectOpt {
  title: string;
  worth: string | number;
}
export interface tSelect {
  title?: string;
  desc?: string;
  data: {
    dataType: "string" | "number";
    start: number;
    opt: tSelectOpt[];
  };
  st: {
    fontSize?: "xs" | "s" | "m" | "l" | "xl";
  };
}
// switcher horizontal
export interface tSwitcherHorizontal {
  title: string;
  data: {
    dataType: "text" | "number";
    start: boolean;
    on: string | number;
    off: string | number;
  };
  st: {
    fontSize?: "xs" | "s" | "m" | "l" | "xl";
  };
}
// part
export interface tGoalWeightBoadyFat {
  weight: number;
  bodyFat: number;
}
export interface tMacro {
  calories?: number;
  proteins?: number;
  fats?: number;
  carbs?: number;
}
// Supabase stores
export interface tCommon {
  username?: string;
  email?: string;
  icon?: number;
}
export interface tConfig {
  language: string;
  theme: string;
  fontSize: number;
  focusColor: string;
}
export interface tBody {
  weight?: number;
  bodyFat?: number;
  height?: number;
  activity?: number;
  gender?: "male" | "female";
  age?: number;
}
export interface tGoal {
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  weight?: number;
  bodyFat?: number;
}
export interface tAuth {
  email?: string;
  password?: string;
}
export interface tWeightLogItem {
  id?: string;
  date?: string;
  weight?: number;
  bodyFat?: number;
}
// Meal
export interface tMealAssetSaved {
  id: string;
  name: string;
  weight: number;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}
export interface tMealAssetUnsaved {
  name: string;
  weight: number;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}
export interface tMealAssetGroup {
  id: string;
  name: string;
  list: string[];
}
export interface tMealTableItem {
  id: string;
  date: string;
  saved: string[];         
  unsaved: tMealAssetUnsaved[];  
  groups: string[];        
}
// Exercise
export interface tExerciseAssetSaved {
  id: string;
  name: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number;
}
export interface tExerciseAssetGroup {
  id: string;
  name: string;
  list: string[];  
}
export interface tExerciseTableItem {
  id: string;
  date: string;
  saved: string[];  
  groups: string[];  
}
// 
export interface tInRound {
  color: string;
  current: number;
  goal: number;
  text: string;
}
