<script setup lang="ts">
import { ref, computed } from "vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { mussle, mussleGrops } from "../../../appSettings/export/vars/sport";

import { useExerciseStore } from "../../../stores/useExerciseStore";
import { useWorkoutStore } from "../../../stores/useWorkoutStore";
import { getDateLikeId, today } from "../../../appSettings/export/vars/default";

const exerciseStore = useExerciseStore();
const workoutStore = useWorkoutStore();

// Активная группа для фильтрации списка мышц
const activeGroup = ref<string | null>('chest');
// Активная конкретная мышца для фильтрации упражнений
const activeMuscle = ref<string | null>(null);

// Хранилище данных для каждого упражнения
const savedData = ref<Map<number, { weight: number; sets: number; reps: number }>>(new Map());
const loading = ref<boolean>(false);

// Фильтрованные мышцы для отображения (по группе)
const filteredMuscles = computed(() => {
  if (!activeGroup.value) return mussle;
  return mussle.filter((item) => item.group === activeGroup.value);
});

// Выбор группы
const selectGroup = (group: string) => {
  if (activeGroup.value === group) {
    activeGroup.value = null;
  } else {
    activeGroup.value = group;
    activeMuscle.value = null;
  }
};

// Выбор конкретной мышцы
const selectMuscle = (muscleWorth: string) => {
  if (activeMuscle.value === muscleWorth) {
    activeMuscle.value = null;
  } else {
    activeMuscle.value = muscleWorth;
  }
};

// Отфильтрованные упражнения
const filteredExercises = computed(() => {
  let exercises = exerciseStore.exercises;
  if (activeMuscle.value) {
    return exercises.filter((exercise) => {
      return exercise.tags?.includes(activeMuscle.value!);
    });
  }

  if (activeGroup.value) {
    return exercises.filter((exercise) => {
      return exercise.tags?.some((tag) => {
        const muscle = mussle.find((m) => m.worth === tag);
        return muscle?.group === activeGroup.value;
      });
    });
  }
  return exercises;
});

// Обработчик обновления из exercisePlus
const handleUpdate = (data: { exerciseId: number; weight: number; sets: number; reps: number } | null, exerciseId: number) => {
  if (!data) {
    savedData.value.delete(exerciseId);
    return;
  }
  savedData.value.set(data.exerciseId, {
    weight: data.weight,
    sets: data.sets,
    reps: data.reps,
  });
};

// Получить сохранённые данные для упражнения
const getInitialData = (exerciseId: number) => {
  return savedData.value.get(exerciseId);
};

// Добавление тренировки
const addWorkout = async () => {
  const validItems: { exerciseId: number; weight: number; sets: number; reps: number }[] = [];

  for (const [exerciseId, data] of savedData.value.entries()) {
    if (data.weight > 0 && data.reps > 0) {
      validItems.push({
        exerciseId,
        weight: data.weight,
        sets: data.sets > 0 ? data.sets : 1,
        reps: data.reps,
      });
    }
  }

  if (validItems.length === 0) {
    console.log("Нет заполненных упражнений");
    return;
  }

  loading.value = true;

  const workout = {
    id: getDateLikeId(),
    date: today,
    list: validItems.map((item, index) => ({
      id: Date.now() + index,
      exerciseId: item.exerciseId,
      weight: item.weight,
      sets: item.sets,
      reps: item.reps,
    })),
  };

  try {
    await workoutStore.addWorkout(workout);
    // Очищаем после успешного сохранения
    savedData.value.clear();
    console.log("Тренировка сохранена");
  } catch (error) {
    console.error("Ошибка сохранения тренировки:", error);
  } finally {
    loading.value = false;
  }
};

import exercisePlus from "../wraps/exercisePlus.vue";
import loadingView from "../../../components/wraps/loading.vue";
</script>

<template>
  <loadingView v-if="loading" />
  <p class="w-100 jus-c bounce text-l add" @click="addWorkout">{{ t("add") }}</p>
  <div class="main">
    <div class="gap-50 over-x filters">
      <p v-for="group in mussleGrops" :key="group" :class="{ active: activeGroup === group }" @click="selectGroup(group)">
        {{ t(group) }}
      </p>
    </div>
  </div>
  <div class="main">
    <div class="gap-50 over-x big-list filters">
      <p v-for="item in filteredMuscles" :key="item.worth" class="text-s" :class="{ active: activeMuscle === item.worth }" @click="selectMuscle(item.worth)">
        {{ t(item.title) }}
      </p>
    </div>
  </div>
  <div class="grid grid-3 gap-50">
    <exercisePlus
      v-for="item in filteredExercises"
      :key="item.id"
      :construct="item"
      :initial-weight="getInitialData(item.id!)?.weight"
      :initial-sets="getInitialData(item.id!)?.sets"
      :initial-reps="getInitialData(item.id!)?.reps"
      @update="(data) => handleUpdate(data, item.id!)"
    />
  </div>
</template>

<style scoped lang="scss">
.add {
  padding: 1rem 0;
  border-radius: 1rem;
  border: dashed 2px var(--ex-color);
  color: var(--ex-color);
}
.main {
  padding: 0.5rem;
  .filters {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;

    p {
      white-space: nowrap;
      padding: 0.25rem 1rem;
      border-radius: 1rem;
      background: var(--ex-background);
      cursor: pointer;

      &.active {
        background: var(--focus);
        color: var(--white);
      }
    }
  }
}
.big-list {
  flex-wrap: wrap;
}

@media (max-width: 720px) {
  .big-list {
    flex-wrap: nowrap;
  }
}
</style>
