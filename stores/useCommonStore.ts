import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tCommon } from "../appSettings/types";

export const useCommonStore = defineStore("common", () => {
  const authStore = useAuthStore();

  const common = ref<tCommon>({
    username: undefined,
    email: undefined,
    icon: 0
  });

  const clearStore = () => {
    common.value = {
      username: undefined,
      email: undefined,
      icon: 0 
    }
  }

  const setStore = (data: tCommon) => {
    common.value = data;
  };

  const getStore = async () => {
    if (!authStore.user) return;
    try {
      const { data, error } = await supabase.from("common").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (error) throw error;
      if (data) setStore(data);
    } catch (err) {
      console.error("Error at 'getConfig': ", err);
    }
  };

  const updateStore = async () => {
    if (!authStore.user) return;
    try {
      const { error: supabaseError } = await supabase.from("common").upsert({ user_id: authStore.user.id, ...common.value  });
      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error("Error at 'updateConfig': ", err);
    }
  };

  return { common, clearStore, setStore, getStore, updateStore };
});
