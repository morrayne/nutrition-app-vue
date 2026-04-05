import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../../appSettings/supabase";
import { useAuthStore } from "../main/useAuthStore";
import type { tGoal } from "../main/types";

export const useGoalStore = defineStore("goal", () => {
  const authStore = useAuthStore();
  const goal = ref<tGoal>({
    calories: 2515,
    proteins: 200,
    carbs: 250,
    fats: 80,
    weight: 82,
    bf: 10,
  });

  const getGoal = async () => {
    if (!authStore.user) return;
    try {
      const { data, error } = await supabase.from("goal").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (error) throw error;
      if (data) setGoal(data);
    } catch (err) {
      console.error("Error at 'getConfig': ", err);
    }
  };

  const updateGoal = async () => {
    if (!authStore.user) return;
    try {
      const { error: supabaseError } = await supabase.from("goal").upsert({ 
        user_id: authStore.user.id, 
        calories: goal.value.calories,
        proteins: goal.value.proteins,
        carbs: goal.value.carbs,
        fats: goal.value.fats,
        weight: goal.value.weight,
        bf: goal.value.bf
      });
      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error("Error at 'updateGoal': ", err);
    }
  };

  const setGoal = (data: tGoal) => {
    goal.value = data;
  };

  const clearGoal = () => {
    goal.value = {
      calories: 2515,
      proteins: 200,
      carbs: 250,
      fats: 80,
      weight: 82,
      bf: 10,
    };
  };

  return { goal, getGoal, updateGoal, setGoal, clearGoal };
});
