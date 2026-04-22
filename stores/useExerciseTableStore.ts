import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tExerciseTableItem } from "../appSettings/types";
import { dateToISO, dateFromISO } from "../appSettings/defaultExport";

export const useExerciseTableStore = defineStore("exerciseTable", () => {
  const authStore = useAuthStore();
  const table = ref<tExerciseTableItem[]>([]);

  const getStore = async () => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("exerciseTable").select("*").eq("user_id", authStore.user.id).order("date", { ascending: false });
    if (!error && data) table.value = data.map(item => ({ id: item.id, date: dateFromISO(item.date), saved: item.saved || [], groups: item.groups || [] }));
  };

  const addSaved = async (date: string, savedIds: string[]) => {
    if (!authStore.user) return;
    const existingIndex = table.value.findIndex(item => item.date === date);
    const dateForDB = dateToISO(date);
    if (existingIndex !== -1) {
      const existing = table.value[existingIndex];
      const updated = { ...existing, saved: [...existing.saved, ...savedIds] };
      const { error } = await supabase.from("exerciseTable").update({ saved: updated.saved }).eq("id", existing.id);
      if (!error) table.value[existingIndex] = updated;
    } else {
      const { data, error } = await supabase.from("exerciseTable").insert({ user_id: authStore.user.id, date: dateForDB, saved: savedIds, groups: [] }).select().single();
      if (!error && data) table.value.unshift({ id: data.id, date: dateFromISO(data.date), saved: data.saved || [], groups: data.groups || [] });
    }
  };

  const addGroup = async (date: string, groupId: string, groupStore: any) => {
    const exerciseIds = groupStore.expandGroup(groupId);
    if (exerciseIds.length) await addSaved(date, exerciseIds);
  };

  return { table, getStore, addSaved, addGroup };
});
