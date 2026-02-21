<script setup lang="ts">
// MAIN IMPORTS
// vue & ui & router
import { ref, computed, watch } from "vue";
import text_input from "../../src/inputs/text_input.vue";
import router from "../../app_settings/router";

// CONTENT
// props & emits
const props = defineProps(["userData"]);
const emit = defineEmits(["update-field", "update-right"]);
// vars
const allowence = computed(() => data.value.username.status === 2 && data.value.email.status === 2 && data.value.password.status === 2);
const data = ref({
  username: {
    placeholder: "redmorrayne",
    status: 0,
  },
  email: {
    placeholder: "example@gmail.com",
    status: 0,
  },
  password: {
    placeholder: "******",
    status: 0,
  },
});

// FUNCTIONS
// information moderation
const checkInfo = (field: string, value: string) => {
  if (field === "username") {
    if (value.length === 0) {
      data.value.username.status = 0;
    } else if (value.length < 4) {
      data.value.username.status = 1;
    } else {
      data.value.username.status = 2;
      UpdateField("username", value);
    }
  } else if (field === "email") {
    if (value.length === 0) {
      data.value.email.status = 0;
    } else if (value.length < 6) {
      data.value.email.status = 1;
    } else {
      data.value.email.status = 2;
      UpdateField("email", value);
    }
  } else if (field === "password") {
    if (value.length === 0) {
      data.value.password.status = 0;
    } else if (value.length < 8) {
      data.value.password.status = 1;
    } else {
      data.value.password.status = 2;
      UpdateField("password", value);
    }
  }
};
// health_data emit
const UpdateField = (field: string, value: string) => {
  emit("update-field", { field, value });
}
// view_data emit
watch(allowence, (new_value) => {
  if (new_value) {
    emit("update-right", { field: "max", value: 3 });
  } else {
    emit("update-right", { field: "min", value: 1 });
  }
});
</script>

<template>
  <div class="w">
    <text_input :data="data.email" field="email" @infoInput="checkInfo" />
    <text_input :data="data.password" field="password" @infoInput="checkInfo" />
    <text_input :data="data.username" field="username" @infoInput="checkInfo" />
    <button @click="router.push('signin')" class="login-btn"></button>
  </div>
</template>

<style scoped>
.w {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .login-btn::after {
    content: var(--have-login);
  }
}

.w {
  padding: 1rem;
  position: relative;

  .login-btn {
    text-align: left;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: var(--text-b);
  }
}
</style>
