import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tGoal } from "../appSettings/types";

export const useGoalStore = defineStore("goal", () => {
  const authStore = useAuthStore();

  const goal = ref<tGoal>({
    calories: undefined,
    proteins: undefined,
    carbs: undefined,
    fats: undefined,
    weight: undefined,
    bodyFat: undefined,
  });

  const clearStore = () => {
    goal.value = {
      calories: undefined,
      proteins: undefined,
      carbs: undefined,
      fats: undefined,
      weight: undefined,
      bodyFat: undefined,
    };
  };

  const setStore = (data: tGoal) => {
    goal.value = data;
  };

  const getStore = async () => {
    if (!authStore.user) return;
    try {
      const { data, error } = await supabase.from("goal").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (error) throw error;
      if (data) setStore(data);
    } catch (err) {
      console.error("Error at 'getStore': ", err);
    }
  };

  const updateStore = async () => {
    if (!authStore.user) return;
    try {
      const { error } = await supabase.from("goal").upsert({ user_id: authStore.user.id, ...goal.value });
      if (error) throw error;
    } catch (err) {
      console.error("Error at 'updateStore': ", err);
    }
  };

  return { goal, clearStore, setStore, getStore, updateStore };
});
