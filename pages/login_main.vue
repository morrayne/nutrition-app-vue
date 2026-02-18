<script setup lang="ts">
// MAIN IMPORTS
// vue
import { ref, computed, watch } from "vue";
import router from "../utils/router";
// ui
import text_input from "@/ui/text_input.vue";
// store
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
const authStore = useAuthStore();
const userStore = useUserStore();

// Данные для входа
const login_data = ref({
  email: "",
  password: "",
});

// Статусы полей
const field_status = ref({
  email: 0,
  password: 0,
});

const allowence = computed(
  () => field_status.value.email === 2 && field_status.value.password === 2,
);

// Ошибка авторизации
const loginError = ref("");

// Функция проверки полей
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

// Авторизация
const handleLogin = async () => {
  if (allowence.value) {
    const result = await authStore.signIn(
      login_data.value.email,
      login_data.value.password,
    );

    if (result.success) {
      setTimeout(() => {
        router.push("/settings");
      }, 2000);
    } else {
      loginError.value = "Invalid email or password";
    }
  }
};

// Следим за валидностью и вызываем login
watch(allowence, (newVal) => {
  if (newVal) { handleLogin() }
});

// Аватарка
const avatarUrl = computed(() => {
  if (userStore.availableAvatars.length === 0) return "";
  const index = userStore.common.icon;
  return userStore.availableAvatars[index] || "";
});
</script>

<!-- prettier-ignore -->
<template>
  <div class="login">
    <h1 class="login-title"></h1>
    <div class="form">
      <div class="preview">
        <div class="img-holder">
          <img v-if="authStore.userEmail" :src="avatarUrl" alt="profile icon" class="icon" />
          <div v-else class="circle"></div>
        </div>
        <div class="text-w">
          <div class="email" v-if="authStore.userEmail"> {{ authStore.userEmail }} </div>
          <div class="box" style="width: 12rem" v-else></div>
          <div class="username" v-if="userStore.common.username"> {{ userStore.common.username }} </div>
          <div class="box" style="width: 8rem" v-else></div>
        </div>
      </div>
      <text_input :data="{ placeholder: 'example@gmail.com', status: field_status.email }" field="email" @infoInput="checkInfo" />
      <text_input :data="{ placeholder: '******', status: field_status.password }" field="password" @infoInput="checkInfo" />
      <p v-if="loginError" class="error">{{ loginError }}</p>
      <button class="back-to-register" @click="router.push('/health')"></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  .form {
    width: 100%;
    height: 18rem;
    background: var(--back-b);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5rem;

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
