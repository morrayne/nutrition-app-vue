<script setup lang="ts">
import { ChevronLeft } from "@lucide/vue";
import router from "../../appSettings/router";
import type { tSignTable } from "../../appSettings/export/types/store";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useAuthStore } from "../../stores/useAuthStore";
const authStore = useAuthStore();

const props = defineProps<{
  modelValue: tSignTable;
  loading: boolean;
}>();
const emits = defineEmits<{
  (e: "loading"): void;
}>();

const handleSignin = async () => {
  emits("loading");
  setTimeout(async () => {
    if (!props.modelValue.email || !props.modelValue.password) return;
    const result = await authStore.signIn(props.modelValue.email, props.modelValue.password);
    if (result.success) {
      emits("loading");
      router.push("/home");
    } else {
      emits("loading");
      console.error(result.error);
    }
  }, 250);
};
</script>

<template>
  <div class="navigation-wrap pos-a jus-c">
    <div class="max-w-640 w-100 main">
      <button class="h-100 ali-c jus-c bounce-m pad-50 arrow" @click="router.push('/signup')"><ChevronLeft color="var(--main-color)" /></button>
      <button class="h-100 ali-c jus-c bounce-s text-m continue" @click="handleSignin">{{ t("signin") }}</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navigation-wrap {
  width: calc(100% - 2rem);
  left: 1rem;
  bottom: 1rem;
  z-index: 3;
  .main {
    height: 3.5rem;
    gap: 0.25rem;
    padding: 0.25rem;
    border-radius: 5rem;
    .continue,
    .arrow {
      border-radius: 5rem;
      background: var(--ex-background);
    }
    .continue {
      flex: 1;
    }
    .arrow {
      aspect-ratio: 1 / 1;
      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
