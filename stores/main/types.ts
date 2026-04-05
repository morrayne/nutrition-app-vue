export interface tAsset {
  id: string;
  product_name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}
export interface tSingleMeal {
  name: string;
  weight: number;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}
export interface tAllMeals {
  date: string;
  total: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  list: tSingleMeal[];
}
export interface tBody {
  gender: string;
  age: number;
  height: number;
  activity: number;
  weight: number;
  bf: number;
}
export interface tCommon {
  username: string;
  email: string;
  icon: number;
  online: boolean;
}
export interface tConfig {
  theme: string;
  language: string;
  newrem: string;
  phoneColor: string;
}
export interface tGoal {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  weight: number;
  bf: number;
}
export interface tAuth {
  email: string;
  password: string;
  username: string;
}
// export interface tWeightEntry {
//   date: string;
//   weight: number;
//   bf: number;
// }
