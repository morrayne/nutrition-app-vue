<script setup lang="ts">
import { ref } from "vue";
import id from "../../src/svg/signup/id.vue";
import siginError from "./signupFolder/siginError.vue";
import control from "./signinFolder/control.vue";
import end from "../ui/end.vue";
import loadingCover from "../ui/loadingCover.vue";
import rowInput from "../form/rowInput.vue";
import type { tRowInput } from "../form/rowInput.vue";
import router from "../../appSettings/router";
import { useAuthStore } from "../../stores/main/useAuthStore";
import localText from "../ui/localText.vue";

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

const loginError = ref(false);
const trySignin = async () => {
  loading.value = true;
  if (!email.value || !password.value) { 
    loading.value = false;
    return 
  };
  const result = await authStore.signIn(email.value, password.value);
  if (result.success) router.push('/account');
  else {
    loading.value = false;
    loginError.value = true;
    setTimeout(() => {
      loginError.value = false;
    }, 5000);
  };
};
</script>

<template>
  <loadingCover v-if="loading" />
  <div class="screen hw100 signin">
    <siginError :error="loginError" />
    <div class="grand-svg-holder">
      <id color="bl" :rotate="0" />
    </div>
    <localText text="sign-in-with" :weight="500" style="margin-top: 1.25rem; text-align: center" />
    <rowInput v-bind="emailConfig" v-model="email" style="margin-top: 0.5rem" />
    <rowInput v-bind="passwordConfig" v-model="password" style="margin-top: 1.25rem" />
    <control @signin="trySignin" />
    <end />
  </div>
</template>

<style scoped lang="scss">
.signin {
  gap: 0;
}
</style>