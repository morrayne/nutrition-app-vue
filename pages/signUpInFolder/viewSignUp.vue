<script setup lang="ts">
// IMPORT
// vue
import { ref, watch, computed } from "vue";
// component
import inp from "@/common/form/inp.vue";
import endUp from "./endUp.vue";
// type
import type { tInp } from "@/common/form/inp.vue";
import type { tAuth } from "../../stores/types";
import type { tUpdateViewArray } from "../signUpPage.vue";

// ERROR
const SCREEN_INDEX = 3; // для signup это экран 3
const hasErrors = ref(false);
const errorMessage = ref<string[]>([]);
const handleError = (err: string[]) => {
  errorMessage.value = [SCREEN_INDEX.toString(), ...err];
  hasErrors.value = err.length > 0;
};

// CONTENT
// props & emits
const props = defineProps<{
  modelValue: tAuth;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: tAuth): void;
  (e: "updateViewArray", value: tUpdateViewArray): void;
  (e: "error", value: string[]): void; 
}>();
// username
const usernameModel = computed({
  get: () => props.modelValue.username,
  set: (val) => emits("update:modelValue", { ...props.modelValue, username: val }),
});
const username: tInp = {
  title: "username",
  data: {
    type: "text" as const,
    start: props.modelValue.username,
  },
  rule: {
    str: {
      minLength: 6,                    
      maxLength: 16,
      toContain: [],
      noToContain: ["@", "#", "$", "%"],
      stringPattern: /^[a-zA-Z][a-zA-Z0-9_ ]*$/ 
    }
  },
  width: { left: 40, right: 60 },
};
// email
const emailModel = computed({
  get: () => props.modelValue.email,
  set: (val) => emits("update:modelValue", { ...props.modelValue, email: val }),
});
const email: tInp = {
  title: "email",
  data: {
    type: "text" as const,
    start: props.modelValue.email,
  },
  rule: {
    str: {
      minLength: 6,
      maxLength: 50,
      toContain: ["@"],
      noToContain: [" "],
      stringPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
  width: { left: 40, right: 60 },
};
// password
const passwordModel = computed({
  get: () => props.modelValue.password,
  set: (val) => emits("update:modelValue", { ...props.modelValue, password: val }),
});
const password: tInp = {
  title: "password",
  data: {
    type: "text" as const,
    start: props.modelValue.password,
  },
  rule: {
    str: {
      minLength: 6,
      maxLength: 20,
      toContain: [],
      noToContain: [" "],
      stringPattern: /^[a-zA-Z0-9!]+$/
    }
  },
  width: { left: 40, right: 60 },
};

// VALIDATION
watch([() => props.modelValue.username, () => props.modelValue.email, () => props.modelValue.password, hasErrors], () => {
  const m = props.modelValue;
  const allFilled = !!m.username && !!m.email && !!m.password;
  const canContinue = allFilled && !hasErrors.value;
  if (!canContinue && hasErrors.value) emits('error', errorMessage.value);
  else if (!canContinue && !hasErrors.value) emits('error', [SCREEN_INDEX.toString(), 'fill-form']);
  else emits('error', []);
  emits('updateViewArray', { index: 3, field: 'signup', newValue: canContinue });
}, { deep: true });
</script>

<template>
  <div class="v">
    <inp v-bind="username" v-model="usernameModel!" @error="handleError" />
    <inp v-bind="email" v-model="emailModel!" @error="handleError" />
    <inp v-bind="password" v-model="passwordModel!" @error="handleError" />
    <endUp />
  </div>
</template>

<style scoped lang="scss">
.v {
  padding: calc(13.5 * var(--mm)) var(--mm) var(--mm);
}
</style>
