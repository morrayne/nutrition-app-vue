// MAIN IMPORTS
// vue & pinia
import { ref, computed } from "vue";
import { defineStore } from "pinia";
// supabase
import { supabase } from "../app_settings/supabase";
import { useAuthStore } from "./useAuthStore";

// TYPES
export interface body_type {
  user_id: string;
  gender: string;
  age: number;
  height: number;
  activity: number;
  weight: number | null;
  bf: number | null;
}

// STORE
export const useBodyStore = defineStore("body", () => {
  // STATE
  const authStore = useAuthStore();
  const error = ref<string | null>(null);
  const body = ref<body_type>({
    user_id: "",
    gender: "male",
    age: 21,
    height: 180,
    activity: 3,
    weight: null,
    bf: null,
  });

  // ACTION
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
  // 
  const setBodyData = (data: Partial<body_type>) => {
    body.value = { ...body.value, ...data };
  };
  // 
  const createBodyData = async (data: Omit<body_type, "user_id">) => {
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
  // 
  const updateBodyData = async (data: Partial<body_type>) => {
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
  // 
  const clearBodyData = () => {
    body.value = {
      user_id: "",
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
