<script setup lang="ts">
import { ChevronLeft, UserRound } from "@lucide/vue";
import router from "../../appSettings/router";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  modelValue: number;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "signup"): void;
}>();

const handleClickBack = () => {
  if (props.modelValue === 0) return;
  emits("update:modelValue", props.modelValue - 1);
};
const handleClickForward = () => {
  if (props.modelValue === 5) emits("signup");
  else emits("update:modelValue", props.modelValue + 1);
};
</script>

<template>
  <div class="navigation-wrap pos-a jus-c">
    <div class="max-w-640 w-100 main pad-25">
      <button class="h-100 ali-c jus-c bounce-m pad-50 arrow" @click="handleClickBack"><ChevronLeft color="var(--main-color)" /></button>
      <button class="h-100 ali-c jus-c bounce-s text-m continue" @click="handleClickForward">{{ t("continue") }}</button>
      <button class="h-100 ali-c jus-c bounce-m pad-75 arrow" @click="router.push('/signin')"><UserRound color="var(--main-color)" /></button>
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
    .continue, .arrow {
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
