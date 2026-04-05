<script setup lang="ts">
import lorem from "../../ui/lorem.vue";
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
    <rowInput v-bind="username" :modelValue="modelValue.username" @update:modelValue="updateAuth('username', $event)" />
    <lorem />
    <rowInput v-bind="email" :modelValue="modelValue.email" @update:modelValue="updateAuth('email', $event)" />
    <rowInput v-bind="password" :modelValue="modelValue.password" @update:modelValue="updateAuth('password', $event)" />
    <end />
  </div>
</template>
