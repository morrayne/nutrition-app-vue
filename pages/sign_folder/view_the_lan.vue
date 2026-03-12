<script setup lang="ts">
// IMPORT
// ui & type
import ui_switch from "@/common/form/ui_switch.vue";
import ui_select from "@/common/form/ui_select.vue";
import type { switch_type } from "@/common/form/ui_switch.vue";
import type { select_type } from "@/common/form/ui_select.vue";

// CONTENT
// emit
const emit = defineEmits<{
  (e: "change-theme", value: string): void;
  (e: "change-lang", value: string | number): void;
}>();
// switcher theme light or dark
const theme: switch_type = {
  text: "dark-theme",
  option1: "light",
  option2: "dark",
}
// language ru or en or zh or es
const lang: select_type[] = [
  { text: "english", value: "en" },
  { text: "russian", value: "ru" },
  { text: "espaniol", value: "es" },
  { text: "mandarin", value: "zh" },
];

// FUNCTION
// return theme
const return_theme = (data: string) => {
  emit("change-theme", data);
}
// return lang
const return_lang = (data: string | number) => {
  emit("change-lang", data);
}
</script>

<template>
  <div class="theme-lang">
    <ui_switch v-bind="theme" @switch="return_theme" />
    <p class="language"></p>
    <ui_select :options="lang" @select="return_lang" />
  </div>
</template>

<style scoped lang="scss">
.theme-lang {
  width: 100%;
  display: flex;
  flex-direction: column;

  .language {
    font-size: var(--mm);
    margin-left: 1.5rem;
    margin-top: 1rem;
    color: var(--text-b);
  }
  
  .language::after {
    content: var(--language);
  }
}
</style>