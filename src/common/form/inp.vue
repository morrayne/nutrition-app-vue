<script setup lang="ts">
// IMPORT
import { ref, watch, computed } from "vue";

export interface tInp {
  title: string;
  data: {
    type: "text" | "number";
    start: string | number | null;
    placeholder?: string;
  };
  rule: {
    str?: {
      minLength: number;
      maxLength: number;
      toContain: string[];
      noToContain: string[];
      stringPattern: RegExp;
    };
    num?: {
      minValue: number;
      maxValue: number;
    };
  };
  width: {
    left: number;
    right: number;
  };
}

// CONTENT
// props
const props = defineProps<tInp & { modelValue?: string | number }>();
// emits
const emits = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "input", value: string | number): void;
  (e: "change", value: string | number): void;
  (e: "error", message: string[]): void;
}>();
// vars
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const inputValue = ref(props.modelValue ?? props.data.start);
const errorMessage = ref<string[]>([]);

// VALIDATION
// text
const validateText = (value: string): boolean => {
  const rules = props.rule.str;
  if (!rules) return true
  if (value.length < rules.minLength) {
    errorMessage.value = [props.title, 'should-be', 'at-least', String(rules.minLength), 'characters-long'];
    return false
  }
  if (value.length > rules.maxLength) {
    errorMessage.value = [props.title, 'should-be', 'maximum', String(rules.maxLength), 'characters-long'];
    return false
  }
  for (const item of rules.toContain) {
    if (!value.includes(item)) {
      errorMessage.value = [props.title, 'has-wrong-format'];
      return false
    }
  }
  for (const item of rules.noToContain) {
    if (value.includes(item)) {
      errorMessage.value = [props.title, 'has-wrong-format'];
      return false
    }
  }
  if (!rules.stringPattern.test(value)) {
    errorMessage.value = [props.title, 'has-wrong-format'];
    return false
  }
  return true
}
// number
const validateNumber = (value: number): boolean => {
  const rules = props.rule.num;
  if (!rules) return true;
  if (isNaN(value)) {
    errorMessage.value = [props.title, 'must-be-number'];
    return false
  }
  if (value < rules.minValue) {
    errorMessage.value = [props.title, 'should-be', 'at-least', String(rules.minValue)];
    return false
  }
  if (value > rules.maxValue) {
    errorMessage.value = [props.title, 'should-be', 'maximum', String(rules.maxValue)];
    return false
  }
  return true
}
// main
const validate = (value: string | number | null): boolean => {
  // console.warn('inp validation start: ', value);
  if (value === null || value === '') {
    errorMessage.value = [props.title, 'fill-empty-inputs'];
    return false 
  }
  let validationResult = false;
  if (props.data.type === 'text') {
    validationResult = validateText(String(value));
  } else {
    validationResult = validateNumber(Number(value));
  }
  // console.log(props.title, validationResult);
  return validationResult
}

// WATCH
// v-model parent changes
watch(() => props.modelValue, (newVal) => {
  if (newVal) inputValue.value = newVal;
});
// local changes
watch(inputValue, (newVal) => {
  if (newVal !== null) emitWithDebounce(newVal);
});

// FUNCTION
// emits with debounce 
const emitWithDebounce = (value: string | number) => {
  if (debounceTimer.value) clearTimeout(debounceTimer.value);
  debounceTimer.value = setTimeout(() => {
    const isValid = validate(value);
    if (isValid && value) {
      emits("update:modelValue", value);
      emits("input", value);
      emits("change", value);
      emits("error", []);
    } else {
      emits("error", errorMessage.value);
    }
    debounceTimer.value = null;
  }, 300);
};
// input handler
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = props.data.type === "number" ? Number(target.value) : target.value;
  inputValue.value = value;
};
// styles
const leftStyle = computed(() => ({
  title: `var(--${props.title})`,
  width: `${props.width.left}%`,
}));
const rightStyle = computed(() => ({
  width: `${props.width.right}%`,
}));
</script>

<template>
  <div class="inp">
    <p class="title" :style="{ '--item-text': leftStyle.title, width: leftStyle.width }"></p>
    <div class="input-wrapper" :style="{ width: rightStyle.width }">
      <input class="input-field" :type="data.type" :placeholder="props.data.placeholder || '...'" :value="inputValue" @input="handleInput" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.inp {
  width: 100%;
  padding: calc(0.75 * var(--mm)) calc(1.5 * var(--mm));
  font-size: var(--mm);
  display: flex;
  justify-content: space-between;
  border-radius: 2rem;
  background: var(--signup-sub-background);
  border: solid 1px var(--signup-main-border);
  box-shadow: var(--box-shadow);
  backdrop-filter: blur(6px);

  .title {
    color: var(--signup-main-text);
    font-weight: 500;
    font-size: var(--mm);
  }

  .title::after {
    content: var(--item-text);
  }

  .input-wrapper {
    overflow: hidden;

    input {
      width: 100%;
      color: var(--signup-sub-text);
      font-weight: 300;
      border: none;
      outline: none;
      background: none;
      font-size: var(--mm);
    }
  }
}
</style>
