<script setup lang="ts">
// vue
import { ref } from "vue";
import router from "../app_settings/router";
import text_input from "@/common/form/ui_text.vue";
import signin_controls from "./sign_folder/signin_controls.vue";
import { useAuthStore } from "../stores/useAuthStore";
import dynamic_island from "@/common/dynamic.vue";
const authStore = useAuthStore();
const formData = ref({
  email: "",
  password: ""
});
const err = ref("");
const handleEmailInput = (value: string) => {
  formData.value.email = value;
};
const handlePasswordInput = (value: string) => {
  formData.value.password = value;
};
const trySignIn = async () => {
  if (!formData.value.email || !formData.value.password) {
    err.value = "";
    await new Promise(resolve => setTimeout(resolve, 10));
    err.value = "enter-login-and-password";
    return;
  }
  const result = await authStore.signIn(formData.value.email, formData.value.password);
  if (result.success) {
    router.push('/account');
  } else {
    err.value = "";
    await new Promise(resolve => setTimeout(resolve, 10));
    err.value = "invalid-credentials";
  }
};
</script>

<template>
  <div class="signin">
    <dynamic_island :text="err" />
    <signin_controls @next="trySignIn" />
    <text_input
      :width_text="45"
      :width_value="55"
      text="email"
      placeholder="mason@gmail.com"
      @input="handleEmailInput"
    />
    <text_input
      :width_text="45"
      :width_value="55"
      text="password"
      placeholder="******"
      @input="handlePasswordInput"
    />
  </div>
</template>

<style scoped lang="scss">
.signin {
  width: 100%;
  height: 100%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  background: var(--back-a);
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
</style>
