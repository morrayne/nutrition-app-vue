import { watch } from "vue";
import { useUserPrivateStore } from "../store/useUserPrivateStore";

export function useTheme() {
  const userPrivateStore = useUserPrivateStore();

  // Применяем тему к документу
  const applyTheme = (theme: "light" | "dark") => {
    // Удаляем старые классы
    document.documentElement.classList.remove("light-theme", "dark-theme");

    // Добавляем новый класс
    document.documentElement.classList.add(`${theme}-theme`);

    // Устанавливаем data-атрибут
    document.documentElement.setAttribute("theme", theme);

    // Устанавливаем CSS переменные если нужно
    if (theme === "dark") {
      document.documentElement.style.setProperty("--color-scheme", "dark");
    } else {
      document.documentElement.style.setProperty("--color-scheme", "light");
    }
  };

  // Применяем язык к документу
  const applyLanguage = (lang: "ru" | "en") => {
    document.documentElement.lang = lang;
  };

  // Инициализация при загрузке
  const initialize = () => {
    // Применяем текущие значения из store
    applyTheme(userPrivateStore.privateData.theme);
    applyLanguage(userPrivateStore.privateData.lang);

    // Следим за изменениями в store
    watch(
      () => userPrivateStore.privateData.theme,
      (newTheme) => {
        applyTheme(newTheme);
      },
    );

    watch(
      () => userPrivateStore.privateData.lang,
      (newLang) => {
        applyLanguage(newLang);
      },
    );
  };

  return {
    applyTheme,
    applyLanguage,
    initialize,
  };
}
