import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tConfig } from "../appSettings/types";

export const useConfigStore = defineStore("config", () => {
  const authStore = useAuthStore();

  const config = ref<tConfig>({
    language: "en",
    theme: "light",
    fontSize: 1,
    focusColor: "#a29bfe"
  });

  const clearStore = () => {
    config.value = {
      language: "en",
      theme: "light",
      fontSize: 1,
      focusColor: "#a29bfe"
    }
  }

  const setStore = (data: tConfig) => {
    config.value = data;
  };

  const getStore = async () => {
    if (!authStore.user) return;
    try {
      const { data, error } = await supabase.from("config").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (error) throw error;
      if (data) {
        setStore(data);
        changeAttrByStore(data);
      };
    } catch (err) {
      console.error("Error at 'getConfig': ", err);
    }
  };

  const updateStore = async () => {
    if (!authStore.user) return;
    try {
      const { error: supabaseError } = await supabase.from("config").upsert({ user_id: authStore.user.id, ...config.value  });
      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error("Error at 'updateConfig': ", err);
    }
  };

  const changeAttrByStore = (data: tConfig) => {
    setStore(data);
    document.documentElement.setAttribute("lang", data.language);
    document.documentElement.setAttribute("data-theme", data.theme);
    document.documentElement.setAttribute("data-font-size", String(data.fontSize));
    document.documentElement.setAttribute("data-focus-color", data.focusColor);
    document.documentElement.style.setProperty('--font-size-modifier', String(data.fontSize));
  document.documentElement.style.setProperty('--focus', data.focusColor);
  }

  return { config, clearStore, setStore, getStore, updateStore, changeAttrByStore };
});
