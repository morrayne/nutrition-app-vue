import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tExerciseAssetSaved } from "../appSettings/types";

export const useExerciseAssetSavedStore = defineStore("exerciseAssetSaved", () => {
  const authStore = useAuthStore();
  const saved = ref<tExerciseAssetSaved[]>([]);

  const getStore = async () => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("exerciseAssetSaved").select("*").eq("user_id", authStore.user.id).order("name", { ascending: true });
    if (!error && data) saved.value = data;
  };

  const addItem = async (item: Omit<tExerciseAssetSaved, "id">) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("exerciseAssetSaved").insert({ user_id: authStore.user.id, ...item }).select().single();
    if (!error && data) saved.value.unshift(data);
    return data;
  };

  const updateItem = async (id: string, updates: Partial<tExerciseAssetSaved>) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("exerciseAssetSaved").update(updates).eq("id", id).select().single();
    if (!error && data) {
      const index = saved.value.findIndex(i => i.id === id);
      if (index !== -1) saved.value[index] = data;
    }
    return data;
  };

  const deleteItem = async (id: string) => {
    if (!authStore.user) return;
    const { error } = await supabase.from("exerciseAssetSaved").delete().eq("id", id);
    if (!error) saved.value = saved.value.filter(i => i.id !== id);
    return !error;
  };

  const getById = (id: string) => saved.value.find(i => i.id === id);

  return { saved, getStore, addItem, updateItem, deleteItem, getById };
});
