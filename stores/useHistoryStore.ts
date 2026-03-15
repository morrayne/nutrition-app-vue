// MAIN IMPORTS
// vue & pinia
import { ref } from "vue";
import { defineStore } from "pinia";
// supabase
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
// type
import type { tHistory, tDailyMeal, tWeightEntry } from "./types";


// STORE
export const useHistoryStore = defineStore("history", () => {
  // STORE
  const authStore = useAuthStore();
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const history = ref<tHistory>({
    user_id: "",
    active_days: [],
    meals: [],
    weight: [],
  });

  // ACTION
  const loadHistory = async () => {
    if (!authStore.user) return;
    isLoading.value = true;
    try {
      const { data, error: supabaseError } = await supabase.from("history").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (supabaseError) throw supabaseError;
      if (data) history.value = data;
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error loading history:", err);
    } finally {
      isLoading.value = false;
    }
  };
  //   
  const createHistory = async () => {
    if (!authStore.user) return;
    try {
      const newData = { user_id: authStore.user.id, active_days: [], meals: [], weight: [] };
      const { error: supabaseError } = await supabase.from("history").insert(newData);
      if (supabaseError) throw supabaseError;
      history.value = newData;
      return { success: true };
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error creating history:", err);
      return { success: false, error: err };
    }
  };
  //   
  const addActiveDay = (date: string) => {
    if (!history.value.active_days.includes(date)) {
      history.value.active_days.push(date);
      history.value.active_days.sort();
    }
  };
  // 
  const addMeal = (meal: tDailyMeal) => {
    const index = history.value.meals.findIndex((m) => m.date === meal.date);
    if (index === -1) history.value.meals.push(meal);
    else history.value.meals[index] = meal;
    history.value.meals.sort((a, b) => b.date.localeCompare(a.date));
  };
  // 
  const addWeightEntry = (entry: tWeightEntry) => {
    const index = history.value.weight.findIndex((w) => w.date === entry.date);
    if (index === -1) history.value.weight.push(entry);
    else history.value.weight[index] = entry;
    history.value.weight.sort((a, b) => b.date.localeCompare(a.date));
  };
  //   
  const updateHistory = async () => {
    if (!authStore.user) return;
    try {
      const { error: supabaseError } = await supabase.from("history").update({ active_days: history.value.active_days, meals: history.value.meals, weight: history.value.weight }).eq("user_id", authStore.user.id);
      if (supabaseError) throw supabaseError;
      return { success: true };
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error updating history:", err);
      return { success: false, error: err };
    }
  };
  // 
  const clearHistory = () => {
    history.value = {
      user_id: "",
      active_days: [],
      meals: [],
      weight: [],
    };
  };

  // EXPORT   
  return { history, isLoading, error, loadHistory, createHistory, addActiveDay, addMeal, addWeightEntry, updateHistory, clearHistory };
});
