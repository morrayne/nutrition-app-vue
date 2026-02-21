<script setup lang="ts">
// MAIN IMPORTS
// vue & ui
import { ref, computed, watch } from "vue";
import router from "../app_settings/router";
import text_input from "../src/inputs/text_input.vue";
import profile_preview from "./account/profile_preview.vue";
// store
import { useAuthStore } from "../stores/useAuthStore";
import { useUserStore } from "../stores/useUserStore";
const authStore = useAuthStore();
const userStore = useUserStore();

// CONTENT
// vars
const allowence = computed(() => field_status.value.email === 2 && field_status.value.password === 2);
const loginError = ref("");
const login_data = ref({
  email: "",
  password: "",
});
const field_status = ref({
  email: 0,
  password: 0,
});

// FUNCTIONS
// information moderation
const checkInfo = (field: string, value: string) => {
  if (field === "email") {
    login_data.value.email = value;
    if (!value) {
      field_status.value.email = 0;
    } else if (!value.includes("@") || value.length < 6) {
      field_status.value.email = 1;
    } else {
      field_status.value.email = 2;
    }
  } else if (field === "password") {
    login_data.value.password = value;
    if (!value) {
      field_status.value.password = 0;
    } else if (value.length < 6) {
      field_status.value.password = 1;
    } else {
      field_status.value.password = 2;
    }
  }
};
// auth
const handleLogin = async () => {
  if (allowence.value) {
    const result = await authStore.signIn(login_data.value.email, login_data.value.password);
    if (result.success) {
      if (userStore.userData.config.first_login) {
        router.push("/account");
      } else {
        router.push("/signup");
      }
    } else {
      loginError.value = "Invalid email or password";
    }
  }
};

// WATCH & COMPUTED
// allowence
watch(allowence, (newVal) => { if (newVal) { handleLogin() }});
</script>

<template>
  <div class="login">
    <div class="form">
      <h1 class="login-title"></h1>
      <profile_preview :data="true"></profile_preview>
      <text_input :data="{ placeholder: 'example@gmail.com', status: field_status.email }" field="email" @infoInput="checkInfo" />
      <text_input :data="{ placeholder: '******', status: field_status.password }" field="password" @infoInput="checkInfo" />
      <p v-if="loginError" class="error">{{ loginError }}</p>
      <button class="back-to-register" @click="router.push('/signup')"></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  width: 100%;
  background: var(--back-a);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.75rem 0.75rem;

  .login-title {
    text-align: left;
    font-size: 1.5rem;
    position: absolute;
    top: -2.5rem;
    left: 0;
  }
  .login-title::after {
    content: var(--login-title);
  }

  .form {
    width: 100%;
    height: 19rem;
    background: var(--back-b);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5rem;
    position: relative;

    .preview {
      width: 100%;
      height: 4.25rem;
      background: var(--back-c);
      border: solid 0.125rem var(--back-d);
      border-radius: 0.75rem;
      padding: 0.5rem;
      display: flex;
      gap: 1rem;

      .img-holder {
        width: 3rem;
        height: 3rem;
        overflow: hidden;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
          scale: 1.1;
        }

        .circle {
          width: 100%;
          height: 100%;
          background: var(--back-d);
        }
      }

      .text-w {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .box {
          height: calc(1.5 * 0.9rem);
          background: var(--back-d);
          border-radius: 0.5rem;
        }

        .email {
          font-size: 0.95rem;
          color: var(--text-a);
        }

        .username {
          font-size: 0.85rem;
          color: var(--text-c);
        }
      }
    }

    .back-to-register {
      text-align: left;
      font-size: 0.8rem;
      color: var(--text-c);
    }
    .back-to-register::after {
      content: var(--back-to-register);
    }
  }
}
</style>
