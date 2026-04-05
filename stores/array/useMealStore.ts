import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../../appSettings/supabase";
import { useAuthStore } from "../main/useAuthStore";
import type { tSingleMeal, tAllMeals } from "../main/types";

export const useMealStore = defineStore("meal", () => {
  const authStore = useAuthStore();
  const meals = ref<tAllMeals[]>([]);
  const today = new Date().toISOString().split("T")[0]!.replace(/-/g, ".");
  
  const getMeals = async () => {
    if (!authStore.user) return;
    try {
      const { data, error: supabaseError } = await supabase.from("arrayMeal").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (supabaseError) throw supabaseError;
      if (data) meals.value = data.meals;
    } catch (err) {
      console.error("Error at 'getMeals': ", err);
    }
  }
  
  const updateMeals = async () => {
    if (!authStore.user) return;
    try {
      const { error: supabaseError } = await supabase.from("arrayMeal").upsert({ user_id: authStore.user.id, meals: meals.value });
      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error("Error at 'updateMeals': ", err);
    }
  };

  const addMeal = async (data: tSingleMeal) => {
    if (meals.value.length > 100) meals.value.shift();
    const todayMeal = meals.value.find((meal) => meal.date === today);
    if (todayMeal) {
      todayMeal.total.calories += data.calories;
      todayMeal.total.proteins += data.proteins;
      todayMeal.total.carbs += data.carbs;
      todayMeal.total.fats += data.fats;
      todayMeal.list.push(data);
    } else {
      const newMeal: tAllMeals = {
        date: today,
        total: {
          calories: data.calories,
          proteins: data.proteins,
          carbs: data.carbs,
          fats: data.fats,
        },
        list: [data],
      };
      meals.value.push(newMeal);
    }
    await updateMeals();
  };

  const clearMeals = async () => {
    meals.value = [];
  }

  return { meals, getMeals, updateMeals, addMeal, clearMeals }
});
