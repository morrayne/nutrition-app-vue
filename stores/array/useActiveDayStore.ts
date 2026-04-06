import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../../appSettings/supabase";
import { useAuthStore } from "../main/useAuthStore";

export const useActiveDayStore = defineStore("activeDay", () => {
  const authStore = useAuthStore();
  const activeDays = ref<string[]>([]);
  const today = new Date().toISOString().split("T")[0]!.replace(/-/g, ".");
  
  const getActiveDays = async () => {
    if (!authStore.user) return;
    try {
      const { data, error: supabaseError } = await supabase.from("arrayActiveDay").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (supabaseError) throw supabaseError;
      if (data) activeDays.value = data.activeDays;
    } catch (err) {
      console.error("Error at 'getActiveDays': ", err);
    }
  };
  
  const updateActiveDays = async () => {
    if (!authStore.user) return;
    try {
      const { error: supabaseError } = await supabase.from("arrayActiveDay").upsert({ user_id: authStore.user.id, activeDays: activeDays.value });
      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error("Error at 'updateActiveDaysInDB': ", err);
    }
  };
  
  const addToday = async () => {
    if (!activeDays.value.includes(today)) {
      if (activeDays.value.length >= 100) activeDays.value.shift(); 
      activeDays.value.push(today);
      await updateActiveDays();
    }
  };

  const clearActiveDays = async () => {
    activeDays.value = [];
  }

  return { activeDays, today, getActiveDays, addToday, clearActiveDays };
});
