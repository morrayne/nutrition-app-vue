<script setup lang="ts">
// IMPORT
// vue
import { ref } from "vue";

// CONTENT
// type
export interface text_input_type {
  width_text: number;
  width_value: number;
  text: string;
  placeholder?: string;
  start_value?: string;
}
// prop & emit
const props = defineProps<text_input_type>();
const emit = defineEmits(["input"]);
// vars
const input_value = ref("");
const debounce = ref<ReturnType<typeof setTimeout> | null>(null);
// debounce input handle function
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const current_value = target.value.trim();
  input_value.value = current_value;
  if (debounce.value) clearTimeout(debounce.value);
  debounce.value = setTimeout(() => {
    if (current_value === '') emit("input", null);
    else emit("input", String(current_value));
  }, 300);
};
</script>

<template>
  <div class="text-input">
    <p :style="{width: `${props.width_text}%`, '--data-text': `var(--${props.text})`}"></p>
    <input :style="{width: `${props.width_value}%`}" type="string" :placeholder="props.placeholder || ''" :value="props.start_value ? props.start_value : input_value" @input="handleInput" />
  </div>
</template>

<style scoped lang="scss">
.text-input {
  margin-bottom: 1rem;
  width: 100%;
  height: 3rem;
  padding: 0 1.5rem;
  border-radius: 1.5rem;
  background: var(--back-b);
  border: 1px solid var(--liquid-glass-border);
  box-shadow: var(--box-shadow);
  display: flex;
  align-items: center;

  p {
    font-size: var(--mm);
    color: var(--text-b);
  }

  p::after {
    content: var(--data-text);
  }

  input {
    color: var(--text-b);
    font-weight: 500;
    border: none;
    outline: none;
    background: none;
  }
}
</style>
