// IMPORT
// vue & pinia
import { ref } from "vue";
import { defineStore } from "pinia";
// supabase
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
// type
import type { tGoal } from "./types";

// STORE
export const useGoalStore = defineStore("goal", () => {
  // STATE
  const authStore = useAuthStore();
  const error = ref<string | null>(null);
  const goal = ref<tGoal>({
    calories: 2000,
    proteins: 120,
    carbs: 250,
    fats: 70,
    weight: null,
    bf: null,
  });

  // ACTION
  const loadGoal = async () => {
    if (!authStore.user) return;
    try {
      const { data, error: supabaseError } = await supabase.from("goal").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (supabaseError) throw supabaseError;
      if (data) goal.value = data;
    } catch (err) {
      error.value = (err as Error).message;
    }
  };
  // 
  const createGoal = async (data: Omit<tGoal, "user_id">) => {
    if (!authStore.user) return;
    try {
      const newData = { user_id: authStore.user.id, ...data };
      const { error: supabaseError } = await supabase.from("goal").insert(newData);
      if (supabaseError) throw supabaseError;
      goal.value = newData;
      return { success: true };
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error creating goals:", err);
      return { success: false, error: err };
    }
  };
  // 
  const updateGoal = async (data: Partial<tGoal>) => {
    if (!authStore.user) return;
    try {
      const { error: supabaseError } = await supabase.from("goal").update(data).eq("user_id", authStore.user.id);
      if (supabaseError) throw supabaseError;
      goal.value = { ...goal.value, ...data };
      return { success: true };
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error updating goals:", err);
      return { success: false, error: err };
    }
  };
  // 
  const clearGoal = () => {
    goal.value = {
      calories: 2000,
      proteins: 120,
      carbs: 250,
      fats: 70,
      weight: null,
      bf: null,
    };
  };

  // EXPORT
  return { goal, error, loadGoal, createGoal, updateGoal, clearGoal };
});
