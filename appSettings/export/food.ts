import type { tMeal, tProductSaved, tProductUnsaved, tProductSavedShort } from "../types/food";

import { useProductStore } from "../../stores/useProductStore";
import { useMealStore } from "../../stores/useMealStore";
import { useFoodHistoryStore } from "../../stores/useFoodHistoryStore";

const deletedProduct: tProductSaved = {
  id: 0,
  name: "deleted",
  calories: 0,
  proteins: 0,
  fats: 0,
  carbs: 0,
};
const deletedProductShort: tProductSavedShort = {
  id: 0,
  weight: 0,
  quantity: 0,
};

export const getProductById = (data: number) => {
  const productStore = useProductStore();
  const productItem: tProductSaved | undefined = productStore.products.find((item) => item.id === data);
  if (productItem) return productItem;
  return deletedProduct;
};
export const getProductShortById = (data: number) => {
  const productStore = useProductStore();
  const foundProduct = productStore.products.find((item) => item.id === data);
  // Если продукт не найден — возвращаем deletedProductShort
  if (!foundProduct) return deletedProductShort;
  return { id: foundProduct.id!, weight: 100, quantity: 0 };
};
export const getMealById = (data: number) => {
  const mealStore = useMealStore();
  const mealItem: tMeal | undefined = mealStore.meals.find((item) => item.id === data);
  if (mealItem) return mealItem;
  return undefined;
};
export const getFoodArrayByDate = (days: number) => {
  const foodHistoryStore = useFoodHistoryStore();
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - days);
  const pastDateStr = pastDate.toISOString().split("T")[0];
  // Фильтруем за последние days дней
  const filtered = foodHistoryStore.foodHistory.filter((item) => item.date && item.date >= pastDateStr).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  // Группируем по дате
  const groupedByDate: Record<string, any[]> = {};
  for (const item of filtered) {
    const date = item.date!;
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(item);
  }
  // Преобразуем в массив с объединёнными данными по дате
  const result = Object.entries(groupedByDate).map(([date, items]) => {
    // Объединяем все продукты из всех intake за этот день
    const allProducts: (tProductSavedShort & { intake: string })[] = [];
    const allMeals: (tMeal & { intake: string })[] = [];
    const allUnsaved: tProductUnsaved[] = [];
    for (const item of items) {
      const intakeType = item.intake;
      // Добавляем продукты с указанием intake
      if (item.products) {
        item.products.forEach((product: any) => {
          const productExists = getProductById(product.id);
          if (productExists) allProducts.push({ ...product, intake: intakeType });
        });
      }
      // Добавляем блюда с указанием intake
      if (item.meals) {
        item.meals.forEach((mealId: number) => {
          const mealExists = getMealById(mealId);
          if (mealExists) allMeals.push({ id: mealId, intake: intakeType });
        });
      }
      // Добавляем unsaved
      if (item.unsaved) allUnsaved.push(...item.unsaved);
    }
    if (allProducts.length === 0 && allMeals.length === 0 && allUnsaved.length === 0) return null;
    return { date, products: allProducts, meals: allMeals, unsaved: allUnsaved };
  });
  return result;
};
export const getMealMacros = (data: number) => {
  let macros = { calories: 0, proteins: 0, fats: 0, carbs: 0 };
  const meal = getMealById(data);
  if (!meal) return macros;
  for (let i = 0; i < meal.list!.length; i++) {
    if (!meal.list || !meal.list[i].id) return 0;
    const product = getProductById(meal.list[i].id);
    const shortProduct = getProductShortById(meal.list[i].id);
    if (!product || !shortProduct) return 0;
    macros.calories += Number((((product!.calories! * meal.list![i].weight) / 100) * meal.list[i].quantity).toFixed(1));
    macros.proteins += Number((((product!.proteins! * meal.list![i].weight) / 100) * meal.list[i].quantity).toFixed(1));
    macros.fats += Number((((product!.fats! * meal.list![i].weight) / 100) * meal.list[i].quantity).toFixed(1));
    macros.carbs += Number((((product!.carbs! * meal.list![i].weight) / 100) * meal.list[i].quantity).toFixed(1));
  }
  return macros;
};
