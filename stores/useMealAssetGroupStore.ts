import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tMealAssetGroup } from "../appSettings/types"; 

export const useMealAssetGroupStore = defineStore("mealAssetGroup", () => {
  const authStore = useAuthStore();
  const groups = ref<tMealAssetGroup[]>([]);

  const getStore = async () => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("mealAssetGroup").select("*").eq("user_id", authStore.user.id);
    if (!error && data) groups.value = data;
  };

  const addGroup = async (group: Omit<tMealAssetGroup, "id">) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("mealAssetGroup").insert({ user_id: authStore.user.id, ...group }).select().single();
    if (!error && data) groups.value.unshift(data);
    return data;
  };

  const updateGroup = async (id: string, updates: Partial<tMealAssetGroup>) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("mealAssetGroup").update(updates).eq("id", id).select().single();
    if (!error && data) {
      const index = groups.value.findIndex(g => g.id === id);
      if (index !== -1) groups.value[index] = data;
    }
    return data;
  };

  const deleteGroup = async (id: string) => {
    if (!authStore.user) return;
    const { error } = await supabase.from("mealAssetGroup").delete().eq("id", id);
    if (!error) groups.value = groups.value.filter(g => g.id !== id);
    return !error;
  };

  const getById = (id: string) => groups.value.find(g => g.id === id);

  const expandGroup = (groupId: string): string[] => {
    const group = getById(groupId);
    return group?.list || [];
  };

  return { groups, getStore, addGroup, updateGroup, deleteGroup, expandGroup };
});
