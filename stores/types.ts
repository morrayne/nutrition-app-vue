// TYPE
// auth
export interface tAuth {
  email: string;
  password: string;
  username: string;
}
export interface tCommon {
  email: string;
  username: string;
  icon: number | null;
  sub_tier: number | null;
  online: boolean;
  first_login: boolean;
}
export interface tConfig {
  theme: string;
  palette: string;
  phone_color: string;
  language: string;
  mm: string;
}
export interface tBody {
  gender: string;
  age: number | null;
  height: number | null;
  activity: number | null;
  weight: number | null;
  bf: number | null;
}
export interface tGoal {
  calories: number | null;
  proteins: number | null;
  carbs: number | null;
  fats: number | null;
  weight: number | null;
  bf: number | null;
}
// history
export interface tMealItem {
  name: string;
  weight: number;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}
export interface tDailyMeal {
  date: string;
  total: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  items: tMealItem[];
}
export interface tWeightEntry {
  date: string;
  weight: number;
  bf: number;
}
export interface tHistory {
  user_id: string;
  active_days: string[];
  meals: tDailyMeal[];
  weight: tWeightEntry[];
}
