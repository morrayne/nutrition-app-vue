<script setup lang="ts">
// IMPORT
// vue
import { ref, computed } from "vue";
// component
import inp from "@/common/form/inp.vue";
import endUp from "./endUp.vue";
// type
import type { tInp } from "@/common/form/inp.vue";
import type { tAuth } from "../../stores/types";

// CONTENT
// props & emits
const props = defineProps<{
  modelValue: tAuth;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: tAuth): void;
}>();
// username
const usernameModel = computed({
  get: () => props.modelValue.username,
  set: (val) =>
    emit("update:modelValue", { ...props.modelValue, username: val }),
});
const username: tInp = {
  title: "username",
  data: {
    type: "text" as const,
    start: props.modelValue.username,
  },
  width: { left: 40, right: 60 },
};
// email
const emailModel = computed({
  get: () => props.modelValue.email,
  set: (val) => emit("update:modelValue", { ...props.modelValue, email: val }),
});
const email: tInp = {
  title: "email",
  data: {
    type: "text" as const,
    start: props.modelValue.email,
  },
  width: { left: 40, right: 60 },
};
// password
const passwordModel = computed({
  get: () => props.modelValue.password,
  set: (val) =>
    emit("update:modelValue", { ...props.modelValue, password: val }),
});
const password: tInp = {
  title: "password",
  data: {
    type: "text" as const,
    start: props.modelValue.password,
  },
  width: { left: 40, right: 60 },
};
</script>

<template>
  <div class="v">
    <inp v-bind="username" v-model="usernameModel" />
    <inp v-bind="email" v-model="emailModel" />
    <inp v-bind="password" v-model="passwordModel" />
    <endUp />
  </div>
</template>

<style scoped lang="scss">
.v {
  padding: calc(13.5 * var(--mm)) var(--mm) var(--mm);
}
</style>
