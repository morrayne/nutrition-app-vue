<script setup lang="ts">
import { ref } from "vue";
import type { tInputString } from "../../appSettings/types/form";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  construct: tInputString;
  modelValue?: string;
  disable?: boolean;
  undercover?: boolean;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const hasCorrect = ref<boolean>(false);
const hasError = ref<boolean>(false);
const placeholder = props.construct.data.placeholder ? t(props.construct.data.placeholder) : "";
const dataType = props.construct.data.dataType;

const handleInput = (event: Event) => {
  const rawValue = (event.target as HTMLInputElement).value;
  let value = rawValue;
  checkForErrors(value, dataType);
  emits("update:modelValue", value);
};

const checkForErrors = (data: string, mode: "string" | "password") => {
  hasError.value = false;
  hasCorrect.value = false;
  if (data === "" || data === null || data === undefined) return;
  const str = String(data).replace(/\s/g, "");
  const rules = props.construct.rule;
  if (str.length < rules.minLength || str.length > rules.maxLength) {
    hasError.value = true;
    return;
  }
  if (rules.toContain?.some((item) => !str.includes(item))) {
    hasError.value = true;
    return;
  }
  if (rules.noToContain?.some((item) => str.includes(item))) {
    hasError.value = true;
    return;
  }
  if (rules.stringPattern && !rules.stringPattern.test(str)) {
    hasError.value = true;
    return;
  }
  hasError.value = false;
  hasCorrect.value = true;
};
</script>

<template>
  <div class="flex-c g-05 w-100">
    <p v-if="props.construct.title" class="fs-l">{{ construct.title }}</p>
    <input
      :name="props.construct.title"
      :disabled="props.disable"
      :type="dataType === 'password' ? 'password' : 'text'"
      class="w-100 def-wrap"
      :class="[hasError ? 'error' : '', hasCorrect ? 'correct' : '']"
      :placeholder="placeholder"
      @input="handleInput"
      :value="modelValue"
      :style="props.undercover ? 'padding: 0.5rem 0.75rem' : ''" />
  </div>
</template>

<style scoped lang="scss">
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
