import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tMealAssetSaved } from "../appSettings/types"; 

export const useMealAssetSavedStore = defineStore("mealAssetSaved", () => {
  const authStore = useAuthStore();
  const saved = ref<tMealAssetSaved[]>([]);

  const getStore = async () => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("mealAssetSaved").select("*").eq("user_id", authStore.user.id);
    if (!error && data) saved.value = data;
  };

  const addItem = async (item: Omit<tMealAssetSaved, "id">) => {
    if (!authStore.user) return;
    console.log(item)
    const { data, error } = await supabase.from("mealAssetSaved").insert({ user_id: authStore.user.id, ...item }).select().single();
    console.log(error)
    if (!error && data) saved.value.unshift(data);
    return data;
  };

  const updateItem = async (id: string, updates: Partial<tMealAssetSaved>) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("mealAssetSaved").update(updates).eq("id", id).select().single();
    if (!error && data) {
      const index = saved.value.findIndex(i => i.id === id);
      if (index !== -1) saved.value[index] = data;
    }
    return data;
  };

  const deleteItem = async (id: string) => {
    if (!authStore.user) return;
    const { error } = await supabase.from("mealAssetSaved").delete().eq("id", id);
    if (!error) saved.value = saved.value.filter(i => i.id !== id);
    return !error;
  };

  return { saved, getStore, addItem, updateItem, deleteItem };
});
