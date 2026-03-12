<script setup lang="ts">
import { ref } from "vue";
import mini_profile from "./account_folder/mini_profile.vue";
import { useAuthStore } from "../stores/useAuthStore";
import router from "../app_settings/router";
const authStore = useAuthStore();
import dynamic_island from "@/common/dynamic.vue";

const err = ref("");

const signout = async () => {
  const result = await authStore.signOut();
  if (result.success) {
    router.push("/signup");
  } else {
    err.value = "sign-out-error";
    console.log("err set to:", err.value);
  }
};
</script>

<template>
  <div class="account">
    <dynamic_island :text="err" />
    <mini_profile :data="false" />
    <div class="sign-out" @click="signout"></div>
  </div>
</template>

<style scoped lang="scss">
.account {
  width: 100%;
  height: 100%;
  padding: 2.5rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--back-a);
  position: relative;
  overflow: hidden;

  .sign-out {
    width: 100%;
    height: 2.5rem;
    border-radius: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--back-b);
    background: var(--accent);
    box-shadow: var(--box-shadow);
    cursor: pointer;
  }
  .sign-out::after {
    content: var(--sign-out);
  }
}
</style>
