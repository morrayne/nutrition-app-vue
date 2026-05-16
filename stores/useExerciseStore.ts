import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tExercise } from "../appSettings/export/types/sport";

export const useExerciseStore = defineStore("exercises", () => {
  const authStore = useAuthStore();
  const exercises = ref<tExercise[]>([]);

  const getStore = async () => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("exercises").select("*").eq("user_id", authStore.user.id);
    if (!error && data) exercises.value = data;
  };

  const addItem = async (item: tExercise) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("exercises").insert({ id: item.id, name: item.name, tags: item.tags || [], user_id: authStore.user.id }).select().single();
    if (!error && data) exercises.value.unshift(data);
    return data;
  };

  const updateItem = async (item: tExercise) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("exercises").update({ name: item.name, tags: item.tags }).eq("id", item.id).select().single();
    if (!error && data) {
      const index = exercises.value.findIndex((i) => i.id === item.id);
      if (index !== -1) exercises.value[index] = data;
    }
    return data;
  };

  const deleteItem = async (id: number) => {
    if (!authStore.user) return;
    const { error } = await supabase.from("exercises").delete().eq("id", id);
    if (!error) exercises.value = exercises.value.filter((i) => i.id !== id);
    return !error;
  };

  return { exercises, getStore, addItem, updateItem, deleteItem };
});
