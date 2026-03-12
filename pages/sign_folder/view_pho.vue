<script setup lang="ts">
// IMPORT
// ui
import ui_select from "@/common/form/ui_select.vue";
import type { select_type } from "@/common/form/ui_select.vue";

// CONTENT
// emit
const emit = defineEmits<{
  (e: "change-phone-color", value: string | number): void;
}>();
// language ru or en or zh or es
const phone_color: select_type[] = [
  { text: "black", value: "black" },
  { text: "white", value: "white" },
  { text: "green", value: "green" },
  { text: "blue", value: "blue" },
  { text: "purple", value: "purple" },
];

// FUNCTION
// return mm
const return_phone_color = (data: string | number) => {
  emit("change-phone-color", data);
}
</script>

<template>
  <div class="theme-lang">
    <p class="phone-color"></p>
    <ui_select :options="phone_color" @select="return_phone_color" />
  </div>
</template>

<style scoped lang="scss">
.theme-lang {
  width: 100%;
  display: flex;
  flex-direction: column;

  .phone-color {
    font-size: var(--mm);
    margin-left: 1.5rem;
    margin-top: 1rem;
    color: var(--text-b);
  }
  
  .phone-color::after {
    content: var(--phone-color);
  }
}
</style>
