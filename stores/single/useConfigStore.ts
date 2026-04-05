import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../../appSettings/supabase";
import { useAuthStore } from "../main/useAuthStore";
import type { tConfig } from "../main/types";

export const useConfigStore = defineStore("config", () => {
  const authStore = useAuthStore();
  const config = ref<tConfig>({
    language: "en",
    theme: "light",
    newrem: "16",
    phoneColor: "blue",
  });

  const getConfig = async () => {
    if (!authStore.user) return;
    try {
      const { data, error } = await supabase.from("config").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (error) throw error;
      if (data) setConfig(data);
    } catch (err) {
      console.error("Error at 'getConfig': ", err);
    }
  };

  const updateConfig = async () => {
    if (!authStore.user) return;
    try {
      const { error: supabaseError } = await supabase.from("config").upsert({ user_id: authStore.user.id, theme: config.value.theme,phoneColor: config.value.phoneColor,language: config.value.language,newrem: config.value.newrem });
      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error("Error at 'updateConfig': ", err);
    }
  };

  const setConfig = (data: tConfig) => {
    config.value = data;
  };

  const changeVisualViaConfig = (newConfig: tConfig) => {
    document.documentElement.setAttribute("lang", newConfig.language);
    document.documentElement.setAttribute("data-theme", newConfig.theme);
    document.documentElement.setAttribute("data-phone-color", newConfig.phoneColor,);
    document.documentElement.setAttribute("data-newrem", newConfig.newrem);
  }

  const clearConfig = () => {
    config.value = {
      language: "en",
      theme: "light",
      newrem: "16",
      phoneColor: "blue",
    };
  };

  return { config, getConfig, updateConfig, setConfig, changeVisualViaConfig, clearConfig };
});
