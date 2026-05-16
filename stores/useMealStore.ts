import { ref } from "vue";
import { defineStore } from "pinia";

import { supabase } from "../appSettings/supabase";
import type { tMeal } from "../appSettings/export/types/food";

import { useAuthStore } from "./useAuthStore";

export const useMealStore = defineStore("meals", () => {
  const authStore = useAuthStore();
  const meals = ref<tMeal[]>([]);

  const getStore = async () => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("meals").select("*").eq("user_id", authStore.user.id);
    if (!error && data) meals.value = data;
  };

  const addItem = async (item: tMeal) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("meals").insert({ user_id: authStore.user.id, ...item }).select().single();
    if (!error && data) meals.value.unshift(data);
    return data;
  };

  const updateItem = async (item: tMeal) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("meals").update(item).eq("id", item.id).select().single();
    if (!error && data) {
      const index = meals.value.findIndex((i) => i.id === item.id);
      if (index !== -1) meals.value[index] = data;
    }
    return data;
  };

  const deleteItem = async (id: number) => {
    if (!authStore.user) return;
    const { error } = await supabase.from("meals").delete().eq("id", id);
    if (!error) meals.value = meals.value.filter((i) => i.id !== id);
    return !error;
  };

  return { meals, getStore, addItem, updateItem, deleteItem };
});
