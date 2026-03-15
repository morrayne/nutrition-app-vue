// IMPORT
// vue & pinia
import { ref } from "vue";
import { defineStore } from "pinia";
// supabase
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
// type
import type { tConfig } from "./types";


// STORE
export const useConfigStore = defineStore("config", () => {
  // STATE
  const authStore = useAuthStore();
  const error = ref<string | null>(null);
  const config = ref<tConfig>({
    language: "en",
    theme: "light",
    palette: "mono",
    phone_color: "black",
    mm: "16",
  });

  // ACTION
  const loadConfig = async () => {
    if (!authStore.user) return;
    try {
      const { data, error: supabaseError } = await supabase.from("config").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (supabaseError) throw supabaseError;
      if (data) setConfig(data); applyConfig(data);
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error loading config:", err);
    }
  };
  // 
  const setConfig = (data: Partial<tConfig>) => {
    config.value = { ...config.value, ...data };
  };
  // 
  const applyConfig = (data: Partial<tConfig>) => {
    if (data.language) document.documentElement.lang = data.language;
    if (data.theme) document.documentElement.setAttribute("data-theme", data.theme);
    if (data.palette) document.documentElement.setAttribute("data-palette", data.palette);
    if (data.phone_color) document.documentElement.setAttribute("data-phone-color", data.phone_color);
    if (data.mm) document.documentElement.setAttribute("data-mm", data.mm);
  };
  // 
  const updateConfig = async (data: Partial<tConfig>) => {
    if (!authStore.user) return;
    try {
      const { error: supabaseError } = await supabase.from("config").update(data).eq("user_id", authStore.user.id);
      if (supabaseError) throw supabaseError;
      setConfig(data); applyConfig(data);
      return { success: true };
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error updating config:", err);
      return { success: false, error: err };
    }
  };
  // 
  const setLang = async (lang: string) => {
    await updateConfig({ language: lang });
  };
  const setTheme = async (theme: string) => {
    await updateConfig({ theme });
  };
  const setPalette = async (palette: string) => {
    await updateConfig({ palette });
  };
  const setPhoneColor = async (color: string) => {
    await updateConfig({ phone_color: color });
  };
  const setMm = async (mm: string) => {
    await updateConfig({ mm });
  };
  // 
  const resetToDefaults = async () => {
    await updateConfig({
      language: "en",
      theme: "light",
      palette: "colorful",
      phone_color: "blue",
      mm: "16",
    });
  };

  // EXPORT
  return { config, error, loadConfig, setConfig, updateConfig, setLang, setTheme, setPalette, setPhoneColor, setMm, resetToDefaults, applyConfig };
});
