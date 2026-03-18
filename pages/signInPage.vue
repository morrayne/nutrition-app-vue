<script setup lang="ts">
// IMPORT
// vue
import { ref, computed } from "vue";
// component
import inp from "@/common/form/inp.vue";
import dynamicIsland from "@/common/ui/dynamicIsland.vue";
import inControl from "./signUpInFolder/inControl.vue";
import endUp from "./signUpInFolder/endUp.vue";
// router
import router from "../appSettings/router";
// store
import { useAuthStore } from "../stores/index";
const authStore = useAuthStore();
// type
import type { tInp } from "@/common/form/inp.vue";

// DATA
const loginData = ref({
  email: "",
  password: "",
});

// COMPUTED FOR INPUTS
const emailModel = computed({
  get: () => loginData.value.email,
  set: (val) => loginData.value.email = val,
});
const email: tInp = {
  title: "email",
  data: {
    type: "text" as const,
    start: '',
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
const passwordModel = computed({
  get: () => loginData.value.password,
  set: (val) => loginData.value.password = val,
});
const password: tInp = {
  title: "password",
  data: {
    type: "text" as const,
    start: '...',
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
const isFormValid = computed(() => {
  return loginData.value.email && loginData.value.password;
});

// LOGIN
const handleSignIn = async () => {
  if (!isFormValid.value) return;
  const result = await authStore.signIn(loginData.value.email, loginData.value.password);
  if (result.success) {
    router.push("/account");
  } else {
    console.log('Login failed');
  }
};
</script>

<template>
  <div class="screen signin">
    <inControl @trySignIn="handleSignIn" />
    <dynamicIsland />
    <inp v-bind="email" v-model="emailModel" />
    <inp v-bind="password" v-model="passwordModel" />
    <endUp />
  </div>
</template>

<style scoped lang="scss">
.signin {
  display: flex;
  gap: 1rem;
  padding: calc(14.5 * var(--mm)) var(--mm) var(--mm);
}
</style>