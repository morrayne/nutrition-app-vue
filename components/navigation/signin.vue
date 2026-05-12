<script setup lang="ts">
import { ChevronLeft } from "@lucide/vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import type { tSignTable } from "../../appSettings/export/types/store";

const props = defineProps<{
  modelValue: tSignTable;
  loading: boolean;
}>();
const emits = defineEmits<{
  (e: "loading"): void;
}>();

import router from "../../appSettings/router";

import { useAuthStore } from "../../stores/useAuthStore";
const authStore = useAuthStore();

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
  <div class="navigation-wrap j-c">
    <div class="max-w-640 w-100 def-wrap">
      <button class="h-100 a-c j-c arrow arrow-r" @click="router.push('/signup')"><ChevronLeft color="var(--main-color)" /></button>
      <button class="h-100 a-c j-c fs-l continue" @click="handleSignin">{{ t("signin") }}</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navigation-wrap {
  width: calc(100% - 2rem);
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  z-index: 3;
  .def-wrap {
    height: 3.5rem;
    gap: 0.375rem;
    padding: 0.125rem;
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
      padding: 0.5rem;
      svg {
        width: 100%;
        height: 100%;
      }
    }
    .continue:hover,
    .arrow:hover {
      scale: 1.025;
    }
    .continue:active,
    .arrow:active {
      scale: 0.975;
    }
  }
}
</style>
