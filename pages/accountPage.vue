<script setup lang="ts">
import { ref } from "vue";
import miniProfile from "./accountFolder/miniProfile.vue";
import loadingCover from "@/common/ui/loadingCover.vue";
import router from "../appSettings/router";
import { useAuthStore } from "../stores";
const authStore = useAuthStore();
const isLoading = ref(false);
const signout = async () => {
   if (isLoading.value) return;
   isLoading.value = true;
   try {
    const result = await authStore.signOut();
    if (result.success) router.push("/signup");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="screen account">
    <loadingCover v-if="isLoading" />
    <miniProfile />
    <button class="signout" @click="signout"></button>
  </div>
</template>

<style scoped lang="scss">
.account{
  padding: var(--mm);
  display: flex;
  flex-direction: column;
  gap: var(--mm);

  .signout {
    padding: calc(0.5 * var(--mm));
    background: var(--signout-background);
    border: solid 1px var(--signout-background);
    border-radius: calc(2.25 * var(--mm));
    color: #e4e4e4;
  }

  .signout:after {
    content: var(--signout);
  }
}
</style>
