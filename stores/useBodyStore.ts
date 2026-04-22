import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tBody } from "../appSettings/types";

export const useBodyStore = defineStore("body", () => {
  const authStore = useAuthStore();

  const body = ref<tBody>({
    weight: undefined,
    bodyFat: undefined,
    height: undefined,
    activity: 1.2,
    gender: "male",
    age: undefined,
  });

  const clearStore = () => {
    body.value = {
      weight: undefined,
      bodyFat: undefined,
      height: undefined,
      activity: 1.2,
      gender: "male",
      age: undefined,
    };
  };

  const setStore = (data: tBody) => {
    body.value = data;
  };

  const getStore = async () => {
    if (!authStore.user) return;
    try {
      const { data, error } = await supabase.from("body").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (error) throw error;
      if (data) setStore(data);
    } catch (err) {
      console.error("Error at 'getStore': ", err);
    }
  };

  const updateStore = async () => {
    if (!authStore.user) return;
    try {
      const { error } = await supabase.from("body").upsert({ user_id: authStore.user.id, ...body.value });
      if (error) throw error;
    } catch (err) {
      console.error("Error at 'updateStore': ", err);
    }
  };

  return { body, clearStore, setStore, getStore, updateStore };
});
