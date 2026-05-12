import { createI18n } from "vue-i18n";
import en from "./en";
import ru from "./ru";
import es from "./es";
import zh from "./zh";

export const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: { en, ru, es, zh },
});
