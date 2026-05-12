import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tWeightLog } from "../appSettings/export/types/store";

export const useWeightLogStore = defineStore("weightLog", () => {
  const authStore = useAuthStore();
  const weightLog = ref<tWeightLog[]>([]);

  const clearStore = () => {
    weightLog.value = [];
  };

  const setStore = (data: tWeightLog[]) => {
    weightLog.value = data;
  };

  const getStore = async () => {
    if (!authStore.user) return;
    try {
      const { data, error } = await supabase.from("weightLog").select("*").eq("user_id", authStore.user.id);
      if (error) throw error;
      if (data) weightLog.value = data;
    } catch (err) {
      console.error("Error at 'getStore': ", err);
    }
  };

  const addEntry = async (entry: Omit<tWeightLog, "id" | "user_id">) => {
    if (!authStore.user) return;
    try {
      const { data, error } = await supabase.from("weightLog").insert({ user_id: authStore.user.id, ...entry }).select().single();
      if (error) throw error;
      if (data) weightLog.value.unshift(data);
      return data;
    } catch (err) {
      console.error("Error at 'addEntry': ", err);
      return null;
    }
  };

  const updateEntry = async (id: number, updates: Partial<Omit<tWeightLog, "id" | "user_id">>) => {
    if (!authStore.user) return;
    try {
      const { data, error } = await supabase.from("weightLog").update(updates).eq("id", id).eq("user_id", authStore.user.id).select().single();
      if (error) throw error;
      if (data) {
        const index = weightLog.value.findIndex((item) => item.id === id);
        if (index !== -1) weightLog.value[index] = data;
      }
      return data;
    } catch (err) {
      console.error("Error at 'updateEntry': ", err);
      return null;
    }
  };

  const deleteEntry = async (id: number) => {
    if (!authStore.user) return;
    try {
      const { error } = await supabase.from("weightLog").delete().eq("id", id).eq("user_id", authStore.user.id);
      if (error) throw error;
      weightLog.value = weightLog.value.filter((item) => item.id !== id);
      return true;
    } catch (err) {
      console.error("Error at 'deleteEntry': ", err);
      return false;
    }
  };

  return { weightLog, clearStore, setStore, getStore, addEntry, updateEntry, deleteEntry };
});
