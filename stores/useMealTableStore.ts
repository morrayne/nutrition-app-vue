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

  const addSaved = async (date: string, savedIds: string[]) => {
    if (!authStore.user) return;
    const existingIndex = table.value.findIndex(item => item.date === date);
    const dateForDB = dateToISO(date);
    if (existingIndex !== -1) {
      const existingItem = table.value[existingIndex];
      if (!existingItem) return;
      const updated = { ...existingItem, saved: [...existingItem.saved, ...savedIds] };
      const { error } = await supabase.from("mealTable").update({ saved: updated.saved }).eq("id", existingItem.id);
      if (!error) table.value[existingIndex] = updated;
    } else {
      const { data, error } = await supabase.from("mealTable").insert({ user_id: authStore.user.id, date: dateForDB, saved: savedIds, unsaved: [],groups: [] }).select().single();
      if (!error && data) table.value.unshift({ ...data, date: dateFromISO(data.date) });
    }
  };

  const addUnsaved = async (date: string, unsavedItems: tMealAssetUnsaved[]) => {
    if (!authStore.user) return;
    const existingIndex = table.value.findIndex(item => item.date === date);
    const dateForDB = dateToISO(date);
    if (existingIndex !== -1) {
      const existingItem = table.value[existingIndex];
      if (!existingItem) return;
      const updated = { ...existingItem, unsaved: [...existingItem.unsaved, ...unsavedItems] };
      const { error } = await supabase.from("mealTable").update({ unsaved: updated.unsaved }).eq("id", existingItem.id);
      if (!error) table.value[existingIndex] = updated;
    } else {
      const { data, error } = await supabase.from("mealTable").insert({ user_id: authStore.user.id, date: dateForDB, saved: [], unsaved: unsavedItems,groups: [] }).select().single();
      if (!error && data) table.value.unshift({ ...data, date: dateFromISO(data.date) });
    }
  };

  const addGroup = async (date: string, groupId: string) => {
    if (!authStore.user) return;
    const existingIndex = table.value.findIndex(item => item.date === date);
    const dateForDB = dateToISO(date);
    if (existingIndex !== -1) {
      const existingItem = table.value[existingIndex];
      if (!existingItem) return;
      const updated = { ...existingItem, groups: [...existingItem.groups, groupId] };
      const { error } = await supabase.from("mealTable").update({ groups: updated.groups }).eq("id", existingItem.id);
      if (!error) table.value[existingIndex] = updated;
    } else {
      const { data, error } = await supabase.from("mealTable").insert({ user_id: authStore.user.id, date: dateForDB, saved: [], unsaved: [],groups: [groupId] }).select().single();
      if (!error && data) table.value.unshift({ ...data, date: dateFromISO(data.date) });
    }
  };

  return { table, getStore, addSaved, addUnsaved, addGroup };
});
