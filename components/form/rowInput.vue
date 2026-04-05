<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";

export interface tRowInput {
  title: string;
  data: {
    type: "string" | "number";
    start?: string | number;
    placeholder?: string;
  };
  rule: {
    string?: {
      minLength: number;
      maxLength: number;
      toContain?: string[];
      noToContain?: string[];
      stringPattern?: RegExp;
    };
    number?: {
      minValue: number;
      maxValue: number;
    };
  };
}

const props = defineProps<tRowInput & { modelValue?: string | number }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'err', message: string): void;
}>();
const inputValue = ref(props.modelValue !== undefined ? props.modelValue : props.data.start ?? '');
const placeholderText = ref('');

const checkInput = (target: string | number): boolean => {
  if (props.data.type === "string") {
    const rules = props.rule.string;
    if (!rules) return true;
    const str = String(target);
    if (str.length < rules.minLength || str.length > rules.maxLength) return false;
    if (rules.toContain) for (const item of rules.toContain) if (!str.includes(item)) return false;
    if (rules.noToContain) for (const item of rules.noToContain) if (str.includes(item)) return false;
    if (rules.stringPattern && !rules.stringPattern.test(str)) return false;
    return true;
  } else {
    const rules = props.rule.number;
    if (!rules) return true;
    const num = Number(target);
    if (isNaN(num)) return false;
    if (num < rules.minValue || num > rules.maxValue) return false;
    return true;
  }
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: string | number = target.value;
  if (props.data.type === "number") value = value === '' ? '' : Number(value);
  inputValue.value = value;
  if (checkInput(value)) {
    emit('update:modelValue', value);
    emit('err', '');
  } else {
    emit('err', 'Invalid value');
  }
};

watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined && newVal !== inputValue.value) {
    inputValue.value = newVal;
  }
});

const updatePlaceholder = () => {
  if (!props.data.placeholder) {
    placeholderText.value = '';
    return;
  }
  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);
  const cssVarName = `--${props.data.placeholder}`;
  let cssVar = computedStyle.getPropertyValue(cssVarName).trim();
  if (cssVar) {
    placeholderText.value = cssVar.replace(/^["']|["']$/g, '');
  } else {
    placeholderText.value = props.data.placeholder;
  }
};

const observer = new MutationObserver(() => {
  updatePlaceholder();
});
onMounted(() => {
  updatePlaceholder();
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
});
onUnmounted(() => {
  observer.disconnect();
});
watch(() => props.data.placeholder, () => {
  updatePlaceholder();
});
</script>

<template>
  <div class="row-input">
    <input :type="props.data.type === 'number' ? 'number' : 'text'" :placeholder="placeholderText" :value="inputValue"@input="handleInput" />
  </div>
</template>

<style scoped lang="scss">
.row-input {
  font-size: var(--size-m);
  padding: calc(0.75 * var(--newrem)) calc(1.25 * var(--newrem));
  border: solid 1px var(--ex-background);
  border-radius: calc(1.5 * var(--newrem));
  background: var(--sub-background);
  box-shadow: var(--box-shadow);
}
</style>
