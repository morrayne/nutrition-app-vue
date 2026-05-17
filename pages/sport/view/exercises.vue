<script setup lang="ts">
import { ref, computed } from "vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { mussle, mussleGrops } from "../../../appSettings/export/vars/sport";

import { useExerciseStore } from "../../../stores/useExerciseStore";
const exerciseStore = useExerciseStore();

// Режим редактора
const menu = ref<boolean>(false);
const editMode = ref<boolean>(false);
const loading = ref<boolean>(false);

// Активная группа для фильтрации списка мышц
const activeGroup = ref<string | null>("chest");
// Активная конкретная мышца для фильтрации упражнений
const activeMuscle = ref<string | null>(null);
const editorActiveGroup = ref<string | null>(null);

// Фильтрованные мышцы для отображения (по группе)
const filteredMuscles = computed(() => {
  if (!activeGroup.value) return mussle;
  return mussle.filter((item) => item.group === activeGroup.value);
});

const editorFilteredMuscles = computed(() => {
  if (!editorActiveGroup.value) return mussle;
  return mussle.filter((item) => item.group === editorActiveGroup.value);
});

// Выбор группы
const selectGroup = (group: string) => {
  if (activeGroup.value === group) {
    activeGroup.value = null;
  } else {
    activeGroup.value = group;
    activeMuscle.value = null; // сбрасываем выбранную мышцу
  }
};

// Выбор конкретной мышцы
const selectMuscle = (muscleWorth: string) => {
  if (activeMuscle.value === muscleWorth) {
    activeMuscle.value = null;
  } else {
    activeMuscle.value = muscleWorth;
    // activeGroup.value = null;
  }
};

const selectEditorGroup = (group: string) => {
  if (editorActiveGroup.value === group) {
    editorActiveGroup.value = null;
  } else {
    editorActiveGroup.value = group;
  }
};

// Отфильтрованные упражнения
const filteredExercises = computed(() => {
  let exercises = exerciseStore.exercises;

  // Если выбрана конкретная мышца
  if (activeMuscle.value) {
    return exercises.filter((exercise) => {
      return exercise.tags?.includes(activeMuscle.value!);
    });
  }

  // Если выбрана группа
  if (activeGroup.value) {
    return exercises.filter((exercise) => {
      return exercise.tags?.some((tag) => {
        const muscle = mussle.find((m) => m.worth === tag);
        return muscle?.group === activeGroup.value;
      });
    });
  }

  // Если ничего не выбрано
  return exercises;
});

// Импорты для формы
import { exerciseName } from "../../../appSettings/export/form/vInputString";
import vInputString from "../../../components/form/vInputString.vue";

import type { tExercise } from "../../../appSettings/export/types/sport";

// Редактор
const editor = ref<tExercise>({
  id: undefined,
  name: undefined,
  tags: [],
});

// Временные теги для редактора
const editorTags = ref<string[]>([]);

import { getDateLikeId } from "../../../appSettings/export/vars/default";
import loadingView from "../../../components/wraps/loading.vue";
import { ArrowLeft, X } from "@lucide/vue";

// Очистка редактора
const clearEditor = () => {
  editor.value = { id: undefined, name: undefined, tags: [] };
  editorTags.value = [];
  editMode.value = false;
  editorActiveGroup.value = "chest";
};

// Открытие создания нового упражнения
const handleNewExercise = () => {
  menu.value = true;
  editMode.value = false;
  clearEditor();
};

// Открытие редактирования
const handleMain = (data: tExercise) => {
  editMode.value = true;
  editor.value = { ...data };
  editorTags.value = [...(data.tags || [])];
  menu.value = true;
};

// Удаление
const handleDelete = async (data: number) => {
  loading.value = true;
  try {
    await exerciseStore.deleteItem(data);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 250);
  }
};

// Сохранение
const finish = async () => {
  if (!editor.value.name) return;
  loading.value = true;
  const e = editor.value;
  e.tags = [...editorTags.value];
  if (editMode.value) {
    try {
      await exerciseStore.updateItem(e);
    } finally {
      setTimeout(() => {
        loading.value = false;
        clearEditor();
        menu.value = false;
      }, 250);
    }
  } else {
    try {
      await exerciseStore.addItem({ id: getDateLikeId(), name: e.name, tags: e.tags });
    } finally {
      setTimeout(() => {
        loading.value = false;
        clearEditor();
        menu.value = false;
      }, 250);
    }
  }
};

// Функции для работы с тегами
const addEditorTag = (tag: string) => {
  if (!editorTags.value.includes(tag)) {
    editorTags.value.push(tag);
  }
};

const removeEditorTag = (tag: string) => {
  editorTags.value = editorTags.value.filter((t) => t !== tag);
};

const isTagSelected = (tag: string) => {
  return editorTags.value.includes(tag);
};

import exerciseCard from "../wraps/exercise.vue";
</script>

<template>
  <loadingView v-if="loading" />
  <div class="w-100 h-100 gap-50 pos-a jus-c over-y editor-wrap" v-if="menu">
    <div class="w-100 flex-c max-w-1440 gap-50 main editor">
      <!-- prettier-ignore -->
      <div class="w-100 gap-50 ali-c double">
        <vInputString :construct="exerciseName" v-model="editor.name" :disable="editMode" />
        <div class="h-100 main round" @click="menu = false; clearEditor()">
          <ArrowLeft color="var(--sub-color)" />
        </div>
      </div>
      <div class="main">
        <div class="gap-50 over-x filters">
          <p v-for="group in mussleGrops" :key="group" :class="{ active: editorActiveGroup === group }" @click="selectEditorGroup(group)">
            {{ t(group) }}
          </p>
        </div>
      </div>
      <div class="main">
        <div class="gap-50 over-x big-list filters">
          <p v-for="item in editorFilteredMuscles" :key="item.worth" style="cursor: pointer" class="text-s" :class="{ selected: isTagSelected(item.worth) }" @click="isTagSelected(item.worth) ? removeEditorTag(item.worth) : addEditorTag(item.worth)">
            {{ t(item.title) }}
          </p>
        </div>
      </div>
      <div class="main selected-tags" v-if="editorTags.length">
        <div class="selected-tags-wrap gap-50">
          <p v-for="tag in editorTags" :key="tag" class="text-xs selected-tag" @click="removeEditorTag(tag)" style="cursor: pointer">
            {{ t(tag) }}
          </p>
        </div>
      </div>
      <div class="w-100 gap-50 ali-c double">
        <p class="w-100 jus-c finish main" @click="finish">{{ t("finish") }}</p>
        <div class="h-100 main round" @click="clearEditor">
          <X color="var(--sub-color)" />
        </div>
      </div>
    </div>
  </div>
  <p class="w-100 jus-c bounce-s text-l add" @click="handleNewExercise" style="cursor: pointer">{{ t("add") }}</p>
  <div class="main">
    <div class="gap-50 over-x filters">
      <p v-for="group in mussleGrops" :key="group" :class="{ active: activeGroup === group }" @click="selectGroup(group)" style="cursor: pointer">
        {{ t(group) }}
      </p>
    </div>
  </div>
  <div class="main">
    <div class="gap-50 over-x big-list filters">
      <p v-for="item in filteredMuscles" :key="item.worth" class="text-s" :class="{ active: activeMuscle === item.worth }" @click="selectMuscle(item.worth)" style="cursor: pointer">
        {{ t(item.title) }}
      </p>
    </div>
  </div>
  <div class="grid grid-3 gap-50">
    <exerciseCard v-for="item in filteredExercises" :key="item.id" :construct="item" @main="handleMain" @delete="handleDelete" />
  </div>
</template>

<style scoped lang="scss">
.editor-wrap {
  align-items: end;
  position: absolute;
  z-index: 10;
  .editor {
    backdrop-filter: blur(0.5rem);
    padding: 1rem;
    border-radius: 2rem;
    .tag-wrap {
      padding: 0.5rem;
      .muscles-selector {
        flex-wrap: wrap;
      }
      p {
        padding: 0.25rem 1rem;
        border-radius: 1rem;
        background: var(--ex-background);
      }
    }
    .selected-tags {
      width: 100%;
      .selected-tags-wrap {
        width: 100%;
        flex-wrap: wrap;
        .selected-tag {
          padding: 0.25rem 1rem;
          border-radius: 1rem;
          background: var(--ex-background);
        }
      }
    }
    .double {
      .main {
        padding: 1rem;
      }
      .finish {
        padding: 0.9rem 1rem;
      }
      .round {
        width: fit-content;
        aspect-ratio: 1 / 1;
        padding: 0.75rem;
        border-radius: 4rem;
        svg {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
  }
}

.add {
  padding: 1rem 0;
  border-radius: 1rem;
  border: dashed 2px var(--ex-color);
  color: var(--ex-color);
}
.main {
  padding: 0.5rem;
  .filters {
    width: fit-content;
    overflow-x: scroll;
    p {
      white-space: nowrap;
      padding: 0.25rem 1rem;
      border-radius: 1rem;
      background: var(--ex-background);
    }
    .active,
    .selected {
      background: var(--focus);
      color: var(--white);
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
