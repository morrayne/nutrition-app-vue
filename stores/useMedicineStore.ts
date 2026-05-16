import { ref } from "vue";
import { defineStore } from "pinia";

import { supabase } from "../appSettings/supabase";
import type { tMed } from "../appSettings/export/types/meds";

import { useAuthStore } from "./useAuthStore";

export const useMedicineStore = defineStore("medicine", () => {
  const authStore = useAuthStore();
  const medicines = ref<tMed[]>([]);

  const getStore = async () => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("medicines").select("*").eq("user_id", authStore.user.id);
    if (!error && data) medicines.value = data;
  };

  const addItem = async (item: tMed) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("medicines").insert({ ...item, user_id: authStore.user.id }).select().single();
    if (!error && data) medicines.value.unshift(data);
    return data;
  };

  const updateItem = async (item: tMed) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("medicines").update(item).eq("id", item.id).select().single();
    if (!error && data) {
      const index = medicines.value.findIndex((i) => i.id === item.id);
      if (index !== -1) medicines.value[index] = data;
    }
    return data;
  };

  const deleteItem = async (id: number) => {
    if (!authStore.user) return;
    const { error } = await supabase.from("medicines").delete().eq("id", id);
    if (!error) medicines.value = medicines.value.filter((i) => i.id !== id);
    return !error;
  };

  return { medicines, getStore, addItem, updateItem, deleteItem };
});
