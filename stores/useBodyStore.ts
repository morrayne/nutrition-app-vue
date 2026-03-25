import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tBody } from "./types";
export const useBodyStore = defineStore("body", () => {
  const authStore = useAuthStore();
  const error = ref<string | null>(null);
  const body = ref<tBody>({
    gender: "male",
    age: 21,
    height: 180,
    activity: 3,
    weight: null,
    bf: null,
  });
  const loadBodyData = async () => {
    if (!authStore.user) return;
    try {
      const { data, error: supabaseError } = await supabase.from("body").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (supabaseError) throw supabaseError;
      if (data) setBodyData(data);
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error loading body data:", err);
    }
  };
  const setBodyData = (data: Partial<tBody>) => {
    body.value = { ...body.value, ...data };
  };
  const createBodyData = async (data: Omit<tBody, "user_id">) => {
    if (!authStore.user) return;
    try {
      const newData = { user_id: authStore.user.id, ...data };
      const { error: supabaseError } = await supabase.from("body").insert(newData);
      if (supabaseError) throw supabaseError;
      setBodyData(newData);
      return { success: true };
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error creating body data:", err);
      return { success: false, error: err };
    }
  };
  const updateBodyData = async (data: Partial<tBody>) => {
    if (!authStore.user) return;
    try {
      const { error: supabaseError } = await supabase.from("body").update(data).eq("user_id", authStore.user.id);
      if (supabaseError) throw supabaseError;
      setBodyData(data);
      return { success: true };
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error updating body data:", err);
      return { success: false, error: err };
    }
  };
  const clearBodyData = () => {
    body.value = {
      gender: "male",
      age: 21,
      height: 180,
      activity: 3,
      weight: null,
      bf: null,
    };
  };
  return { body, error, loadBodyData, setBodyData, createBodyData, updateBodyData, clearBodyData };
});
