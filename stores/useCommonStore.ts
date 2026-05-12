import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tCommonTable } from "../appSettings/export/types/store";

export const useCommonStore = defineStore("common", () => {
  const authStore = useAuthStore();

  const common = ref<tCommonTable>({
    username: undefined,
    email: undefined,
    icon: 0,
    language: "en",
    theme: "dark",
    fontSize: 1,
    focusColor: "#a29bfe",
  });

  const clearStore = () => {
    common.value = {
      username: undefined,
      email: undefined,
      icon: 0,
      language: "en",
      theme: "dark",
      fontSize: 1,
      focusColor: "#a29bfe",
    };
  };

  const setStore = (data: tCommonTable) => {
    common.value = data;
    updateVisual(data);
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
      const { error: supabaseError } = await supabase.from("common").upsert({ user_id: authStore.user.id, ...common.value });
      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error("Error at 'updateConfig': ", err);
    }
  };

  const updateVisual = (data: tCommonTable) => {
    document.documentElement.setAttribute("lang", data.language);
    document.documentElement.setAttribute("data-theme", data.theme);
    document.documentElement.setAttribute("data-font-size", String(data.fontSize));
    document.documentElement.setAttribute("data-focus-color", data.focusColor);
    document.documentElement.style.setProperty('--font-size-modifier', String(data.fontSize));
    document.documentElement.style.setProperty('--focus', data.focusColor);
  }

  return { common, clearStore, setStore, getStore, updateStore, updateVisual };
});
