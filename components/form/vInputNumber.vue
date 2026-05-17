<script setup lang="ts">
import { ref, watch } from "vue";
import type { tInputNumber } from "../../appSettings/export/types/form";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  construct: tInputNumber;
  modelValue?: number;
  disable?: boolean;
  undercover?: boolean;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const hasCorrect = ref<boolean>(false);
const hasError = ref<boolean>(false);
const placeholder = props.construct.data.placeholder ? t(props.construct.data.placeholder) : "";
const localValue = ref<string>(props.modelValue?.toString() ?? "");

const checkForErrors = (data: number) => {
  hasError.value = false;
  hasCorrect.value = false;
  if (isNaN(data)) return;
  const rules = props.construct.rule;
  if (!rules) {
    hasCorrect.value = true;
    return;
  }
  if (data < rules.minValue || data > rules.maxValue) {
    hasError.value = true;
    return;
  }
  hasCorrect.value = true;
};

const handleInput = (event: Event) => {
  let rawValue = (event.target as HTMLInputElement).value;
  rawValue = rawValue.replace(/[^\d.,-]/g, "");
  let normalized = rawValue.replace(",", ".");
  const parts = normalized.split(".");
  if (parts.length > 2) normalized = parts[0] + "." + parts.slice(1).join("");
  localValue.value = normalized;
  if (normalized === "" || normalized === "-") {
    emits("update:modelValue", 0);
    checkForErrors(0);
    return;
  }
  const num = parseFloat(normalized);
  if (isNaN(num)) {
    hasError.value = true;
    emits("update:modelValue", 0);
    return;
  }
  checkForErrors(num);
  emits("update:modelValue", num);
};

watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined && newVal !== null && !isNaN(newVal) && newVal !== 0) {
    localValue.value = newVal.toString();
    checkForErrors(newVal);
  } else {
    localValue.value = "";
    hasError.value = false;
    hasCorrect.value = false;
  }
});
</script>

<template>
  <div class="flex-c gap-50 w-100">
    <p v-if="props.construct.title" class="text-l">{{ t(props.construct.title) }}</p>
    <input
      :name="props.construct.title"
      :disabled="props.disable"
      type="text"
      inputmode="decimal"
      class="w-100 main"
      :class="[hasError ? 'error' : '', hasCorrect ? 'correct' : '']"
      :placeholder="placeholder"
      @input="handleInput"
      :value="localValue"
      :style="props.undercover ? 'padding: 0.5rem 0.75rem' : ''" />
  </div>
</template>

<style scoped lang="scss">
.main {
  padding: 1rem 1.5rem;
}
.error {
  border: solid 1px var(--re);
}
.correct {
  border: solid 1px var(--gr);
}
input:disabled {
  color: var(--ex-color);
  cursor: not-allowed;
}
</style>
