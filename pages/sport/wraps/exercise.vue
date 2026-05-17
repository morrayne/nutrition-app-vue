<script setup lang="ts">
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
  <div class="flex-c gap-50 bounce-s main" @click="emits('main', props.construct)">
    <p class="fs-l fw-6" v-if="props.construct.name">{{ props.construct.name }}</p>
    <div class="gap-50 bb">
      <p class="text-xs" v-for="item in props.construct.tags">{{ t(item) }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bb {
  flex-wrap: wrap;
  p {
    padding: 0.25rem 0.75rem;
    border-radius: 2rem;
    background: var(--ex-background);
  }
}
</style>
