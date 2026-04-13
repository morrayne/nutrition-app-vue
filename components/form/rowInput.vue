<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import localText from "../ui/localText.vue";
import type { err } from "../pages/signupFolder/errorManager.vue";

export interface tRowInput {
  title: string;
  desc?: string;
  data: {
    paddingScale?: boolean;
    displayExternal?: boolean;
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
const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
  (e: 'err', message: err): void;
}>();
const inputValue = ref(props.data.start ? props.modelValue : props.data.start);
const placeholderText = ref('');

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: string | number = target.value;
  if (props.data.type === "number") value = value === '' ? '' : Number(value);
  inputValue.value = value;
  const validation = checkInput(value);
  if (validation.interaction !== 'err') emits('update:modelValue', value);
  emits('err', validation);
};

const checkInput = (target: string | number) => {
  const errorMessege : err = { interaction: 'err-fix', page: 0, field: props.title, text: [], errValue: '' } 
  errorMessege.errValue = target;
  if (props.data.type === "string") {
    const rules = props.rule.string;
    if (!rules) return errorMessege;
    const str = String(target);
    if (str.length < rules.minLength) {
      errorMessege.interaction = 'err';
      errorMessege.text.push('length', 'should-be', 'longer');
    } 
    if (str.length > rules.maxLength) {
      errorMessege.interaction = 'err';
      errorMessege.text.push('length', 'should-be', 'shorter');
    } 
    if (rules.toContain) for (const item of rules.toContain) if (!str.includes(item)) {
      errorMessege.interaction = 'err';
      errorMessege.text.push('wrong-format');
    };
    if (rules.noToContain) for (const item of rules.noToContain) if (str.includes(item)) {
      errorMessege.interaction = 'err';
      errorMessege.text.push('wrong-format');
    };
    if (rules.stringPattern && !rules.stringPattern.test(str)) {
      errorMessege.interaction = 'err';
      errorMessege.text.push('wrong-format');
    };
  } else {
    const rules = props.rule.number;
    if (!rules) return errorMessege;
    const num = Number(target);
    if (isNaN(num)) {
      errorMessege.interaction = 'err';
      errorMessege.text.push('wrong-format');
    };
    if (num < rules.minValue ) {
      errorMessege.interaction = 'err';
      errorMessege.text.push('should-be', 'more-than');
    } 
    if (num > rules.maxValue) {
      errorMessege.interaction = 'err';
      errorMessege.text.push('should-be', 'less-than');
    } 
  }
  return errorMessege
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

const cmToFeet = (cm: number) => {
  const result = String((cm / 30.4).toFixed(1));
  if (result === 'NaN') return 0
  else return result
}
const kgToLbs = (kg: number) => {
  const result = String((kg * 2.2).toFixed(1));
  if (result === 'NaN') return 0
  else return result
}
</script>

<template>
  <div class="row-input">
    <div :class="props.data.paddingScale ? 'input small' : 'input big'">
      <input :type="props.data.type === 'number' ? 'number' : 'text'" :placeholder="placeholderText" :value="inputValue" @input="handleInput" />
    </div>
    <div class="bottom" v-if="props.data.displayExternal">
      <localText v-if="props.title === 'weight' || props.title === 'height'" text="approximately" size="s" />
      <div class="transition" v-if="(props.data.type === 'number') && (props.title === 'weight')">{{ kgToLbs(Number(inputValue))}}</div>
      <localText v-if="(props.data.type === 'number') && (props.title === 'weight')" text="lbs" size="s" />
      <div class="transition" v-if="(props.data.type === 'number') && (props.title === 'height')">{{ cmToFeet(Number(inputValue)) }}</div>
      <localText v-if="(props.data.type === 'number') && (props.title === 'height')" text="ft" size="s" />
    </div>
    <localText class="under-desc" v-if="props.desc" :text="props.desc" size="s" />
  </div>
</template>

<style scoped lang="scss">
.row-input {
  flex-direction: column;
  gap: 0.5rem;
  .input {
    font-size: var(--size-m);
    border: solid 1px var(--ex-background);
    border-radius: calc(1.5 * var(--newrem));
    background: var(--sub-background);
    box-shadow: var(--box-shadow);
    input {
      width: 100%;
    }
  }
  .big {
    padding: calc(0.75 * var(--newrem)) calc(1.25 * var(--newrem));
  }
  .small {
    padding: calc(0.5 * var(--newrem)) calc(0.75 * var(--newrem));
  }
  .bottom {
    justify-content: center;
    color: var(--ex-color);
    gap: calc(0.65 * var(--size-s));
    .transition {
      font-size: var(--size-s);
    }
  }
  .under-desc {
    margin-top: 0.25rem;
    color: var(--ex-color);
  }
}
</style>
