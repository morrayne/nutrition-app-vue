export interface tSignTable {
  email?: string;
  password?: string;
}
export interface tBodyTable {
  age?: number;
  height?: number;
  gender: "male" | "female";
  activity: number;
  weightNow?: number;
  bodyFatNow?: number;
  calories?: number;
  proteins?: number;
  fats?: number;
  carbs?: number;
  weightGoal?: number;
  bodyFatGoal?: number;
}
export interface tCommonTable {
  username?: string;
  email?: string;
  icon: number;
  language: string;
  theme: "light" | "dark";
  fontSize: number;
  focusColor: string;
}
export interface tWeightLog {
  id?: number;
  date?: string;
  weight?: number;
  bodyFat?: number;
}
