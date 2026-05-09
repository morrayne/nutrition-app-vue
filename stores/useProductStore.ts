import { ref } from "vue";
import { defineStore } from "pinia";

import { supabase } from "../appSettings/supabase";
import type { tProductSaved } from "../appSettings/types/food";

import { useAuthStore } from "./useAuthStore";

export const useProductStore = defineStore("products", () => {
  const authStore = useAuthStore();
  const products = ref<tProductSaved[]>([]);

  const getStore = async () => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("products").select("*").eq("user_id", authStore.user.id);
    if (!error && data) products.value = data;
  };

  const addItem = async (item: tProductSaved) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("products").insert({ ...item, user_id: authStore.user.id }).select().single();
    if (!error && data) products.value.unshift(data);
    return data;
  };

  const updateItem = async (item: tProductSaved) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("products").update(item).eq("id", item.id).select().single();
    if (!error && data) {
      const index = products.value.findIndex((i) => i.id === item.id);
      if (index !== -1) products.value[index] = data;
    }
    return data;
  };

  const deleteItem = async (id: number) => {
    if (!authStore.user) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) products.value = products.value.filter((i) => i.id !== id);
    return !error;
  };

  return { products, getStore, addItem, updateItem, deleteItem };
});
