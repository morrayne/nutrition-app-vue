import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tMealTableItem, tMealAssetUnsaved } from "../appSettings/types";
import { dateToISO, dateFromISO } from "../appSettings/defaultExport";

export const useMealTableStore = defineStore("mealTable", () => {
  const authStore = useAuthStore();
  const table = ref<tMealTableItem[]>([]); 

  const getStore = async () => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("mealTable").select("*").eq("user_id", authStore.user.id).order("date", { ascending: false });
    if (!error && data) table.value = data.map(item => ({ ...item, date: dateFromISO(item.date) }));
  };

  const addToMealTable = async (item: tMealTableItem) => {
    if (!authStore.user) return;
    const dateForDB = dateToISO(item.date);
    const { data, error } = await supabase.from("mealTable").insert({ user_id: authStore.user.id, date: dateForDB, saved: item.saved || [], unsaved: item.unsaved || [], groups: item.groups || [] }).select().single();
    if (error) {
      console.error("Ошибка:", error);
    } else if (data) {
      table.value.unshift({ ...data, date: dateFromISO(data.date) });
    }
  };

  return { table, getStore, addToMealTable };
});
