<script setup lang="ts">
import type { tExercise } from "../../../appSettings/export/types/sport";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  construct: tExercise;
  active?: boolean;
  initialWeight?: number;
  initialSets?: number;
  initialReps?: number;
}>();

const emits = defineEmits<{
  (e: "update", value: { exerciseId: number; weight: number; sets: number; reps: number } | null): void;
}>();

import vInputNumber from "../../../components/form/vInputNumber.vue";
import { sets, reps, exWeight } from "../../../appSettings/export/form/vInputNumber";
import { ref, watch } from "vue";

// Локальные данные для инпутов с инициализацией из пропсов
const weight = ref<number | undefined>(props.initialWeight);
const setsCount = ref<number | undefined>(props.initialSets);
const repsCount = ref<number | undefined>(props.initialReps);

// Следим за изменениями пропсов из родителя (при восстановлении данных)
watch(
  () => props.initialWeight,
  (val) => {
    if (val !== undefined) weight.value = val;
  },
);
watch(
  () => props.initialSets,
  (val) => {
    if (val !== undefined) setsCount.value = val;
  },
);
watch(
  () => props.initialReps,
  (val) => {
    if (val !== undefined) repsCount.value = val;
  },
);

// Отслеживаем изменения и отправляем родителю
watch([weight, setsCount, repsCount], () => {
  if (weight.value !== undefined && weight.value > 0 && repsCount.value !== undefined && repsCount.value > 0) {
    emits("update", {
      exerciseId: props.construct.id!,
      weight: weight.value,
      sets: setsCount.value && setsCount.value > 0 ? setsCount.value : 1,
      reps: repsCount.value,
    });
  } else {
    emits("update", null);
  }
});
</script>

<template>
  <div class="flex-c g-05 bounce def-wrap">
    <p class="fs-l fw-6" v-if="props.construct.name">{{ props.construct.name }}</p>
    <div class="w-100 g-05 grid">
      <vInputNumber :construct="exWeight" :undercover="true" v-model="weight" />
      <vInputNumber :construct="reps" :undercover="true" v-model="repsCount" />
      <vInputNumber :construct="sets" :undercover="true" v-model="setsCount" />
    </div>
    <div class="g-05 bb">
      <p class="fs-s" v-for="item in props.construct.tags" :key="item">{{ t(item) }}</p>
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
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
