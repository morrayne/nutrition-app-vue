import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tExerciseAssetGroup } from "../appSettings/types";

export const useExerciseAssetGroupStore = defineStore("exerciseAssetGroup", () => {
  const authStore = useAuthStore();
  const groups = ref<tExerciseAssetGroup[]>([]);

  const getStore = async () => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("exerciseAssetGroup").select("*").eq("user_id", authStore.user.id).order("name", { ascending: true });
    if (!error && data) groups.value = data;
  };

  const addGroup = async (group: Omit<tExerciseAssetGroup, "id">) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("exerciseAssetGroup").insert({ user_id: authStore.user.id, ...group }).select().single();
    if (!error && data) groups.value.unshift(data);
    return data;
  };

  const updateGroup = async (id: string, updates: Partial<tExerciseAssetGroup>) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("exerciseAssetGroup").update(updates).eq("id", id).select().single();
    if (!error && data) {
      const index = groups.value.findIndex(g => g.id === id);
      if (index !== -1) groups.value[index] = data;
    }
    return data;
  };

  const deleteGroup = async (id: string) => {
    if (!authStore.user) return;
    const { error } = await supabase.from("exerciseAssetGroup").delete().eq("id", id);
    if (!error) groups.value = groups.value.filter(g => g.id !== id);
    return !error;
  };

  const getById = (id: string) => groups.value.find(g => g.id === id);

  const expandGroup = (groupId: string): string[] => {
    const group = getById(groupId);
    return group?.list || [];
  };

  return { groups, getStore, addGroup, updateGroup, deleteGroup, getById, expandGroup };
});
