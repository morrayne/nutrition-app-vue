<script setup lang="ts">
import { ref } from "vue";
import control from "./signinFolder/control.vue";
import end from "../ui/end.vue";
import loadingCover from "../ui/loadingCover.vue";
import lorem from "../ui/lorem.vue";
import rowInput from "../form/rowInput.vue";
import type { tRowInput } from "../form/rowInput.vue";
import router from "../../appSettings/router";
import { useAuthStore } from "../../stores/main/useAuthStore";

const authStore = useAuthStore();
const loading = ref(false);

const email = ref("");
const emailConfig: tRowInput = {
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

const password = ref("");
const passwordConfig: tRowInput = {
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

const trySignin = async () => {
  loading.value = true;
  if (!email.value || !password.value) { 
    loading.value = false;
    return 
  };
  const result = await authStore.signIn(email.value, password.value);
  if (result.success) router.push('/account');
};
</script>

<template>
  <div class="screen hw100 signin">
    <lorem />
    <loadingCover v-if="loading" />
    <rowInput v-bind="emailConfig" v-model="email" />
    <rowInput v-bind="passwordConfig" v-model="password" />
    <control @signin="trySignin" />
    <end />
  </div>
</template>
