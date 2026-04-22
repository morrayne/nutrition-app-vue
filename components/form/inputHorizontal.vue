<script setup lang="ts">
import { ref, watch } from "vue";
import { X } from "@lucide/vue";
import type { tInputHorizontal } from "../../appSettings/types";

import { useI18n } from "vue-i18n";
import { p } from "vue-router/dist/index-Cu9B0wDz.mjs";
const { t } = useI18n();

const props = defineProps<tInputHorizontal & { modelValue?: string | number }>();
const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'error', hasError: boolean): void;
}>();

const inputValue = ref(props.modelValue ?? props.data.start ?? '');
const hasError = ref(false);
let errorTimer: ReturnType<typeof setTimeout> | null = null;

const checkInput = (target: string | number): boolean => {
  if (target === '') { 
    emits('update:modelValue', '');
    return false
  };
  if (!target) return true;
  if (props.data.dataType !== "number") {
    const rules = props.rule.string;
    if (!rules) return false;
    const str = String(target);
    const lengthWithoutSpaces = str.replace(/\s/g, '').length;
    if (lengthWithoutSpaces < rules.minLength) return true;
    if (lengthWithoutSpaces > rules.maxLength) return true;
    if (rules.toContain) for (const item of rules.toContain) if (!str.includes(item)) return true;
    if (rules.noToContain) for (const item of rules.noToContain) if (str.includes(item)) return true;
    if (rules.stringPattern && !rules.stringPattern.test(str)) return true;
  } else {
    const rules = props.rule.number;
    if (!rules) return false;
    const num = Number(target);
    if (isNaN(num)) return true;
    if (num < rules.minValue) return true;
    if (num > rules.maxValue) return true;
  }
  return false;
};

const updateErrorState = (value: string | number) => {
  const hasErrors = checkInput(value);
  if (!hasErrors) {
    if (errorTimer) {
      clearTimeout(errorTimer);
      errorTimer = null;
    }
    hasError.value = false;
    emits('error', false);
  } else {
    if (errorTimer) clearTimeout(errorTimer);
    errorTimer = setTimeout(() => {
      hasError.value = true;
      emits('error', true);
      errorTimer = null;
    }, 500);
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: string | number = target.value;
  if (props.data.dataType === 'number') value = value === '' ? '' : Number(value);
  inputValue.value = value;
  updateErrorState(value);
  if (!checkInput(value)) emits('update:modelValue', value);
};

watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined && newVal !== inputValue.value) {
    inputValue.value = newVal;
    updateErrorState(newVal);
  }
});

</script>

<template>
  <div class="input-horizontal">
    <input class="mini-wrap input" :type="props.data.dataType" :placeholder="t(props.title)" :value="inputValue" @input="handleInput" />
    <div :class="hasError ? 'error-wrap open' : 'error-wrap close'">
      <div class="error">
        <X color="var(--white)" />
      </div>
    </div>
    <p class="lbs" v-if="props.st.displayExternal === 'weight-kg'"> {{ t('aproximetly') + ' ' + (Number(inputValue) * 2.2).toFixed(1) + ' ' + t('lbs') }} </p>
    <p class="lbs" v-if="props.st.displayExternal === 'height-cm'"> {{ t('aproximetly') + ' ' + (Number(inputValue) * 0.033).toFixed(1) + ' ' + t('ft') }} </p>
  </div>
</template>

<style scoped lang="scss">
.input-horizontal {
  width: 100%;
  flex-direction: column;
  position: relative;
  .lbs {
    width: 100%;
    font-size: var(--size-xs);
    justify-content: center;
  }
  .title {
    font-size: var(--size-l);
    font-weight: 500;
  }
  .desc {
    font-size: var(--size-s);
  }
  .input {
    width: 100%;
    padding: 1rem 2rem;
    border-radius: 2.5rem;
  }
  .error-wrap {
    height: 100%;
    align-items: center;
    position: absolute;
    top: 0rem;

    .error {
      width: calc(2 * var(--size-m));
      height: calc(2 * var(--size-m));
      background: var(--re);
      border-radius: 2rem;
      align-items: center;
      justify-content: center;
    }
  }
  .open {
    right: 0.75rem;
    opacity: 1;
  }
  .close {
    right: -1rem;
    opacity: 0;
  }
}
</style>
