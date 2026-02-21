<script setup lang="ts">
// MAIN IMPORTS
// vue & ui
import { ref, computed, watch } from "vue";
import number_input from "../../src/inputs/number_input.vue";

// CONTENT
// props & emits
const props = defineProps(["userData"]);
const emit = defineEmits(["update-field", "update-right"]);
// vars
const possible_activity = [1.15, 1.3, 1.45, 1.6, 1.75, 1.9];
const current_activity = ref<number>(props.userData?.activity || 1.45);
const allowence = computed(() => data.value.weight.status === 2 && data.value.bf.status === 2);
const data = ref({
  weight: {
    placeholder: "72 kg",
    status: 0,
  },
  bf: {
    placeholder: "12 %",
    status: 0,
  },
});

// FUNCTIONS
// information moderation
const checkInfo = (field: string, value: number) => {
  if (field === "weight") {
    if (!value) {
      data.value.weight.status = 0;
    } else if (value < 30 || value > 150) {
      data.value.weight.status = 1;
    } else {
      data.value.weight.status = 2;
      UpdateField("weight", value);
    }
  } else if (field === "bf") {
    if (!value) {
      data.value.bf.status = 0;
    } else if (value < 5 || value > 35) {
      data.value.bf.status = 1;
    } else {
      data.value.bf.status = 2;
      UpdateField("bf", value);
    }
  }
};
// health_data emit
const UpdateField = (field: string, value: number) => {
  emit("update-field", { field, value });
};
// activity select
function selectActivity(value: number) {
  current_activity.value = value;
  UpdateField("activity", value);
}
// view_data emit
watch(allowence, () => {
  if (allowence.value) {
    emit("update-right", { field: "max", value: 5 });
  } else {
    emit("update-right", { field: "max", value: 4 });
  }
});
</script>

<template>
  <div class="w">
    <number_input :data="data.weight" field="weight" @infoInput="checkInfo" />
    <number_input :data="data.bf" field="bf" @infoInput="checkInfo" />
    <div class="activity">
      <p class="activity-title"></p>
      <div class="options-grid">
        <div v-for="value in possible_activity" :key="value" :class="['option', { active: value === current_activity }]" @click="selectActivity(value)">
          {{ value }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.w {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  position: relative;

  .activity {
    margin-top: 0.5rem;
    width: 100%;

    .activity-title {
      margin-bottom: 0.25rem;

      &::after {
        content: var(--choose-activity);
      }
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;

      .option {
        padding: 0.5rem;
        aspect-ratio: 1 / 1;
        background: var(--back-c);
        border: solid 0.125rem var(--back-d);
        color: var(--text-c);
        border-radius: 0.75rem;
      }

      .active {
        border: solid 0.125rem var(--text-a);
        background: var(--back-c);
        color: var(--text-a);
      }
    }
  }
}
</style>
