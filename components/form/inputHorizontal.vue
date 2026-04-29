<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { X } from "@lucide/vue";
import type { tInputHorizontal } from "../../appSettings/types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps<tInputHorizontal & { modelValue?: string | number }>();
const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'error', hasError: boolean): void;
}>();

const inputValue = ref<string | number>(props.modelValue ?? props.data.start ?? '');
const hasError = ref(false);
let errorTimer: ReturnType<typeof setTimeout> | null = null;

const isNumeric = computed(() => props.data.dataType === "number");
const validateString = (str: string, rules: NonNullable<tInputHorizontal['rule']['string']>): boolean => {
  const cleanedStr = str.replace(/\s/g, '');
  if (cleanedStr.length < rules.minLength || cleanedStr.length > rules.maxLength) return true;
  if (rules.toContain?.some(item => !str.includes(item))) return true;
  if (rules.noToContain?.some(item => str.includes(item))) return true;
  if (rules.stringPattern && !rules.stringPattern.test(str)) return true;
  return false;
};

const validateNumber = (num: number, rules: NonNullable<tInputHorizontal['rule']['number']>): boolean => {
  if (isNaN(num)) return true;
  return num < rules.minValue || num > rules.maxValue;
};

const checkInput = (value: string | number): boolean => {
  if (value === '') {
    emits('update:modelValue', '');
    return false;
  }
  if (isNumeric.value) {
    const numberRules = props.rule.number;
    if (!numberRules) return false;
    return validateNumber(Number(value), numberRules);
  } else {
    const stringRules = props.rule.string;
    if (!stringRules) return false;
    return validateString(String(value), stringRules);
  }
};

const updateErrorState = (value: string | number) => {
  const hasErrors = checkInput(value);
  if (errorTimer) clearTimeout(errorTimer);
  if (!hasErrors) {
    hasError.value = false;
    emits('error', false);
    errorTimer = null;
  } else {
    errorTimer = setTimeout(() => {
      hasError.value = true;
      emits('error', true);
      errorTimer = null;
    }, 500);
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const rawValue = target.value;
  let value: string | number;
  if (isNumeric.value && rawValue !== '') value = Number(rawValue);
  else value = rawValue;
  inputValue.value = value;
  const hasErrors = checkInput(value);
  updateErrorState(value);
  if (!hasErrors) {
    emits('update:modelValue', value);
  }
};

watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined && newVal !== inputValue.value) {
    inputValue.value = newVal;
    updateErrorState(newVal);
  }
});

const displayText = computed(() => {
  const numValue = Number(inputValue.value);
  if (isNaN(numValue)) return null;
  switch (props.st.displayExternal) {
    case 'weight-kg': return `${t('aproximetly')} ${(numValue * 2.2).toFixed(1)} ${t('lbs')}`;
    case 'height-cm': return `${t('aproximetly')} ${(numValue * 0.033).toFixed(1)} ${t('ft')}`;
    default : return null;
  }
});

const inputStyle = computed(() => ({
  padding: props.st.padding || '1rem 2rem',
  fontSize: props.st.fontSize ? `var(--size-${props.st.fontSize})` : 'var(--size-m)'
}));
const containerStyle = computed(() => ({
  marginBottom: props.st.displayExternal ? 'var(--size-m)' : '0'
}));
</script>

<template>
  <div class="fl-col prz-2 input-horizontal" :style="containerStyle">
    <input class="solid-wrap input" :style="inputStyle" :type="props.data.dataType === 'password' ? 'password' : props.data.dataType === 'number' ? 'number' : 'text'":placeholder="t(props.data.placeholder || props.title)" :value="inputValue" @input="handleInput" />
    <div :class="['center error-wrap', hasError ? 'open' : 'close']">
      <div class="wh-100 error">
        <X color="var(--white)" />
      </div>
    </div>
    <p v-if="displayText" class="center lbs">
      {{ displayText }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.input-horizontal {
  width: 100%;
  gap: 0.25rem !important;
  .title {
    font-size: var(--size-l);
    font-weight: 500;
  }
  .desc {
    font-size: var(--size-m);
    font-weight: 400;
  }
  .lbs {
    width: 100%;
    font-weight: 400;
    position: absolute;
    top: calc(2.5rem + var(--size-m));
    font-size: var(--size-xs);
  }
  .input {
    width: 100%;
    padding: 1rem 2rem;
    border-radius: 2.5rem;
  }
  .error-wrap {
    height: 100%;
    aspect-ratio: 1 / 1;
    padding: 0.75rem;
    position: absolute;
    top: 0;
    right: 0;
    .error {
      background: var(--re);
      border-radius: 2rem;
      align-items: center;
      justify-content: center;
    }
  }
  .open {
    opacity: 1;
  }
  .close {
    opacity: 0;
  }
}
</style>
