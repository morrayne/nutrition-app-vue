<script setup lang="ts">
import type { tWorkoutItem, tExercise } from "../../../appSettings/export/types/sport";

const props = defineProps<{
  construct: tWorkoutItem;
}>();

import { useExerciseStore } from "../../../stores/useExerciseStore";
const exerciseStore = useExerciseStore();

const secondItem: tExercise | undefined = exerciseStore.exercises.find((exercise) => exercise.id === props.construct.exerciseId);

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import vInputNumber from "../../../components/form/vInputNumber.vue";
import { sets, reps, exWeight } from "../../../appSettings/export/form/vInputNumber";
import { ref, watch } from "vue";

// Локальные данные для инпутов с инициализацией из пропсов
const weight = ref<number | undefined>(props.construct.weight);
const setsCount = ref<number | undefined>(props.construct.sets);
const repsCount = ref<number | undefined>(props.construct.reps);
</script>

<template>
  <div class="flex-c gap-50 bounce-s main">
    <p class="text-l" v-if="secondItem">{{ secondItem.name }}</p>
    <div class="w-100 gap-50 grid">
      <vInputNumber :construct="exWeight" :undercover="true" :disable="true" v-model="weight" />
      <vInputNumber :construct="reps" :undercover="true" :disable="true" v-model="repsCount" />
      <vInputNumber :construct="sets" :undercover="true" :disable="true" v-model="setsCount" />
    </div>
    <div class="gap-50 bb" v-if="secondItem">
      <p class="text-xs" v-for="item in secondItem.tags" :key="item">{{ t(item) }}</p>
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
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
</style>
