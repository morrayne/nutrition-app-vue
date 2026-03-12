<script setup lang="ts">
// IMPORT
// ui
import ui_select from "@/common/form/ui_select.vue";
import type { select_type } from "@/common/form/ui_select.vue";
import ui_switch from "@/common/form/ui_switch.vue";
import type { switch_type } from "@/common/form/ui_switch.vue";

// CONTENT
// emit
const emit = defineEmits<{
  (e: "change-palette", value: string): void;
  (e: "change-mm", value: string | number): void;
}>();
// switcher palette colorful or greyscale
const palette: switch_type = {
  text: "greyscale-palette",
  option2: "greyscale",
  option1: "colorful",
}
const mm: select_type[] = [
  { text: "small", value: "14" },
  { text: "medium", value: "16" },
  { text: "large", value: "18" },
];

// FUNCTION
// return palette
const return_palette = (data: string) => {
  emit("change-palette", data);
}
// return mm
const return_mm = (data: string | number) => {
  emit("change-mm", data);
}
</script>

<template>
  <div class="palette-mm">
    <ui_switch v-bind="palette" @switch="return_palette" />
    <p class="font-size"></p>
    <ui_select :options="mm" @select="return_mm" />
  </div>
</template>

<style scoped lang="scss">
.palette-mm {
  width: 100%;
  display: flex;
  flex-direction: column;

  .font-size {
    font-size: var(--mm);
    margin-left: 1.5rem;
    margin-top: 1rem;
    color: var(--text-b);
  }
  
  .font-size::after {
    content: var(--font-size);
  }
}
</style>
