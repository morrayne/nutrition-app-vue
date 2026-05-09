import { ref } from "vue";
import { defineStore } from "pinia";

import { supabase } from "../appSettings/supabase";
import type { tFoodHistory } from "../appSettings/types/food";

import { useAuthStore } from "./useAuthStore";
import { getDateLikeId, today } from "../appSettings/export/default";

export const useFoodHistoryStore = defineStore("foodHistory", () => {
  const authStore = useAuthStore();
  const foodHistory = ref<tFoodHistory[]>([]);

  const getStore = async () => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("foodHistory").select("*").eq("user_id", authStore.user.id);
    if (!error && data) foodHistory.value = data;
  };

  const addItem = async (newItem: tFoodHistory) => {
    if (!authStore.user) return null;

    const item: tFoodHistory = {
      ...newItem,
      date: today,
      id: getDateLikeId(),
    };

    const existingEntry = foodHistory.value.find((entry) => entry.date === item.date && entry.intake === item.intake);

    if (!existingEntry) {
      const insertData = {
        user_id: authStore.user.id,
        id: item.id,
        date: item.date,
        intake: item.intake,
        products: item.products || [],
        meals: item.meals || [],
        unsaved: item.unsaved || [],
      };

      const { data, error } = await supabase.from("foodHistory").insert(insertData).select().single();

      if (error) return null;
      if (data) foodHistory.value.unshift(data);
      return data;
    } else {
      const existingProducts = existingEntry.products || [];
      const newProducts = item.products || [];
      const mergedProducts = [...existingProducts];

      for (const newProduct of newProducts) {
        const existingIndex = mergedProducts.findIndex((p) => p.id === newProduct.id && p.weight === newProduct.weight);

        if (existingIndex !== -1) {
          const newQuantity = (mergedProducts[existingIndex].quantity || 1) + (newProduct.quantity || 1);
          mergedProducts[existingIndex].quantity = Math.min(newQuantity, 10);
        } else {
          mergedProducts.push(newProduct);
        }
      }

      const mergedMeals = [...(existingEntry.meals || []), ...(item.meals || [])];
      const mergedUnsaved = [...(existingEntry.unsaved || []), ...(item.unsaved || [])];

      const updatedItem = {
        ...existingEntry,
        products: mergedProducts,
        meals: mergedMeals,
        unsaved: mergedUnsaved,
      };

      const { data, error } = await supabase.from("foodHistory").update(updatedItem).eq("id", existingEntry.id).select().single();

      if (error) return null;
      if (data) {
        const index = foodHistory.value.findIndex((i) => i.id === data.id);
        if (index !== -1) foodHistory.value[index] = data;
      }
      return data;
    }
  };

  return { foodHistory, getStore, addItem };
});
