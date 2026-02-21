// MAIN IMPORTS
// vue & theme
import { watch } from "vue";
import { useUserStore } from "../stores/useUserStore";

// CONTENT
// function
export function useTheme() {
  const userStore = useUserStore();
  // theme
  const applyTheme = (theme: "light" | "dark") => {
    document.documentElement.classList.remove("light-theme", "dark-theme");
    document.documentElement.classList.add(`${theme}-theme`);
    document.documentElement.setAttribute("theme", theme);
  };
  // language
  const applyLanguage = (lang: "ru" | "en") => { 
    document.documentElement.lang = lang 
  };
  // monochrome (опционально, если нужно)
  const applyMonochrome = (mode: "mono" | "multi") => {
    document.documentElement.setAttribute("monochrome", mode);
  };
  // onmounted initialization
  const initialize = () => {
    // Применяем текущие настройки
    applyTheme(userStore.userData.config.theme);
    applyLanguage(userStore.userData.config.lang);
    applyMonochrome(userStore.userData.config.monochrome);
    // Следим за изменениями
    watch(() => userStore.userData.config.theme, (newTheme) => { 
      applyTheme(newTheme) 
    });
    watch(() => userStore.userData.config.lang, (newLang) => { 
      applyLanguage(newLang) 
    });
    watch(() => userStore.userData.config.monochrome, (newMode) => { 
      applyMonochrome(newMode) 
    });
  };
  // exports
  return { applyTheme, applyLanguage, applyMonochrome, initialize };
}
