<script setup lang="ts">
import { X } from "@lucide/vue";

import type { tExercise } from "../../../appSettings/export/types/sport";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  construct: tExercise;
  active?: boolean;
}>();
const emits = defineEmits<{
  (e: "main", value: tExercise): void;
  (e: "delete", value: number): void;
}>();
</script>

<template>
  <div class="flex-c g-05 bounce def-wrap" @click="emits('main', props.construct)">
    <p class="fs-l fw-6" v-if="props.construct.name">{{ props.construct.name }}</p>
    <div class="g-05 bb">
      <p class="fs-s" v-for="item in props.construct.tags">{{ t(item) }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.def-wrap {
  padding: 1rem !important;
  .bb {
    flex-wrap: wrap;
    p {
      padding: 0.25rem 0.75rem;
      border-radius: 2rem;
      background: var(--ex-background);
    }
  }
}
</style>
