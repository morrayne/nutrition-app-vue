<script setup lang="ts">
import { ChevronLeft, UserRound } from "@lucide/vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  modelValue: number;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "signup"): void;
}>();

import router from "../../appSettings/router";

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
  <div class="navigation-wrap j-c">
    <div class="max-w-640 w-100 def-wrap">
      <button class="h-100 a-c j-c arrow arrow-l" @click="handleClickBack"><ChevronLeft color="var(--main-color)" /></button>
      <button class="h-100 a-c j-c fs-l continue" @click="handleClickForward">{{ t("continue") }}</button>
      <button class="h-100 a-c j-c arrow arrow-r" @click="router.push('/signin')"><UserRound color="var(--main-color)" /></button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navigation-wrap {
  width: calc(100% - 2rem);
  position: fixed;
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
      svg {
        width: 100%;
        height: 100%;
      }
    }
    .arrow-l {
      padding: 0.5rem;
    }
    .arrow-r {
      padding: 0.75rem;
    }
    .continue:hover, .arrow:hover {
      scale: 1.025;
    }
    .continue:active, .arrow:active {
      scale: 0.975;
    }
  }
}
</style>
