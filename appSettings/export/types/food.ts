export interface tProductSavedShort {
  id: number;
  weight: number;
  quantity: number;
}
export interface tProductSaved {
  id?: number;
  name?: string;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
}
export interface tProductUnsaved {
  name?: string;
  weight?: number;
  calories?: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
}
export interface tMeal {
  id?: number;
  name?: string;
  list?: tProductSavedShort[];
}
export interface tFoodHistory {
  id?: number;
  date?: string;
  intake?: string;
  products?: tProductSavedShort[];
  meals?: number[];
  unsaved?: tProductUnsaved[];
}
