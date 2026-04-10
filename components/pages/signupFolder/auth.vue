<script setup lang="ts">
import id from "@/svg/signup/id.vue";
import localText from "../../ui/localText.vue";
import end from "../../ui/end.vue";
import rowInput from "../../form/rowInput.vue";
import type { tRowInput } from "../../form/rowInput.vue";
import type { tAuth } from "../../../stores/main/types";

const props = defineProps<{
  modelValue: tAuth;
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', value: tAuth): void;
}>();
const updateAuth = (key: keyof tAuth, value: any) => {
  emits('update:modelValue', { ...props.modelValue, [key]: value });
};

const username: tRowInput = {
  title: "username",
  data: {
    type: "string",
    placeholder: "username",
  },
  rule: {
    string: {
      minLength: 6,                    
      maxLength: 16,
      toContain: [],
      noToContain: ["@", "#", "$", "%"],
      stringPattern: /^[a-zA-Z][a-zA-Z0-9_ ]*$/ 
    }
  },
};
const email: tRowInput = {
  title: "email",
  data: {
    type: "string",
    placeholder: "email",
  },
  rule: {
    string: {
      minLength: 6,
      maxLength: 50,
      toContain: ["@"],
      noToContain: [" "],
      stringPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  },
};
const password: tRowInput = {
  title: "password",
  data: {
    type: "string",
    placeholder: "password",
  },
  rule: {
    string: {
      minLength: 6,
      maxLength: 20,
      toContain: [],
      noToContain: [" "],
      stringPattern: /^[a-zA-Z0-9!]+$/
    }
  },
};
</script>

<template>
  <div class="hw100 auth">
    <div class="grand-svg-holder">
      <id color="bl" :rotate="0" />
    </div>
    <localText text="sign-up-with" :weight="500" style="margin-top: 1.25rem; text-align: center" />
    <rowInput v-bind="username" :modelValue="modelValue.username" @update:modelValue="updateAuth('username', $event)" style="margin-top: 0.5rem" />
    <rowInput v-bind="email" :modelValue="modelValue.email" @update:modelValue="updateAuth('email', $event)" style="margin-top: 1.25rem" />
    <rowInput v-bind="password" :modelValue="modelValue.password" @update:modelValue="updateAuth('password', $event)" style="margin-top: 1.25rem" />
    <end />
  </div>
</template>

<style scoped lang="scss">
.auth {
  gap: 0;
}
</style>
