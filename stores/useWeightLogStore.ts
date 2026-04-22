import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tWeightLogItem } from "../appSettings/types";
import { dateToISO, dateFromISO } from "../appSettings/defaultExport";

export const useWeightLogStore = defineStore("weightLog", () => {
  const authStore = useAuthStore();
  const weightLog = ref<tWeightLogItem[]>([]);

  const clearStore = () => {
    weightLog.value = [];
  };

  const setStore = (data: tWeightLogItem[]) => {
    weightLog.value = data;
  };

  const getStore = async () => {
    if (!authStore.user) return;
    try {
      const { data, error } = await supabase.from("weightLog").select("*").eq("user_id", authStore.user.id).order("date", { ascending: false });
      if (error) throw error;
      if (data) {
        const formattedData = data.map(item => ({ ...item, date: dateFromISO(item.date) }));
        setStore(formattedData);
      }
    } catch (err) {
      console.error("Error at 'getStore': ", err);
    }
  };

  const addEntry = async (entry: Omit<tWeightLogItem, "id">) => {
    if (!authStore.user) return;
    try {
      const dateForDB = dateToISO(entry.date!);
      const { data, error } = await supabase.from("weightLog").insert({ user_id: authStore.user.id, ...entry, date: dateForDB }).select().single();
      if (error) throw error;
      if (data) weightLog.value.unshift({ ...data, date: dateFromISO(data.date) });
      return data;
    } catch (err) {
      console.error("Error at 'addEntry': ", err);
      return null;
    }
  };

  const updateEntry = async (id: string, updates: Partial<tWeightLogItem>) => {
    if (!authStore.user) return;
    try {
      const updateData = { ...updates };
      if (updates.date) updateData.date = dateToISO(updates.date);
      const { data, error } = await supabase.from("weightLog").update(updateData).eq("id", id).select().single();
      if (error) throw error;
      if (data) {
        const index = weightLog.value.findIndex(item => item.id === id);
        if (index !== -1) weightLog.value[index] = { ...data, date: dateFromISO(data.date) };
      }
      return data;
    } catch (err) {
      console.error("Error at 'updateEntry': ", err);
      return null;
    }
  };

  const deleteEntry = async (id: string) => {
    if (!authStore.user) return;
    try {
      const { error } = await supabase.from("weightLog").delete().eq("id", id);
      if (error) throw error;
      weightLog.value = weightLog.value.filter(item => item.id !== id);
      return true;
    } catch (err) {
      console.error("Error at 'deleteEntry': ", err);
      return false;
    }
  };

  return { weightLog, clearStore, setStore, getStore, addEntry, updateEntry, deleteEntry };
});
