<script setup lang="ts">
// IMPORT
// vue & ui
import { ref, watch } from "vue";
import text_input from "@/common/form/ui_text.vue";

// CONTENT
// emit
const emit = defineEmits<{
  (e: "change-auth", value: { username: string; email: string; password: string }): void;
  (e: "set-err", value: string): void;
}>();
// form data obj
const form = ref({
  username: "",
  email: "",
  password: ""
});
// validation
const isValidUsername = (username: string): boolean => {
  return username.length >= 2 && username.length <= 50;
};
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const isValidPassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 100;
};

// Watch для валидации
watch(form, () => {
  const { username, email, password } = form.value;
  if (!username || !email || !password) return;
  // Username validation
  if (!isValidUsername(username)) {
    emit("set-err", "username-too-short");
    return;
  }
  // Email validation
  if (!isValidEmail(email)) {
    emit("set-err", "invalid-email");
    return;
  }
  // Password validation
  if (!isValidPassword(password)) {
    emit("set-err", "password-too-short");
    return;
  }
  emit("change-auth", { ...form.value });
}, { deep: true });

// handlers
const handleUsernameInput = (value: string) => {
  form.value.username = value;
};
const handleEmailInput = (value: string) => {
  form.value.email = value;
};
const handlePasswordInput = (value: string) => {
  form.value.password = value;
};
</script>

<template>
  <div class="gender-age-height">
    <text_input :width_text="45" :width_value="55" text="username" placeholder="mason muller" @input="handleUsernameInput" />
    <text_input :width_text="45" :width_value="55" text="email" placeholder="mason@gmail.com" @input="handleEmailInput" />
    <text_input :width_text="45" :width_value="55" text="password" placeholder="******" @input="handlePasswordInput" />
  </div>
</template>

<style scoped lang="scss">
.gender-age-height {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
