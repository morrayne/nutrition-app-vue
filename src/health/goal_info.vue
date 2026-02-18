<script setup lang="ts">
// MAIN IMPORTS
// vue
import { ref, computed, watch } from "vue";
// ui
import number_input from "@/ui/number_input.vue";

// PROPS & EMITS
// props
const props = defineProps(["userData"]);
// emits
const emit = defineEmits(["update-field", "update-right"]);

// MAIN VARS
const allowence = computed(() => data.value.goalWeight.status === 2 && data.value.goalBf.status === 2);
const data = ref({
  goalWeight: {
    placeholder: "82 kg",
    status: 0,
  },
  goalBf: {
    placeholder: "8 %",
    status: 0,
  },
});

// FUNCTIONS
// information moderation
const checkInfo = (field: string, value: number) => {
  if (field === "goalWeight") {
    if (!value) {
      data.value.goalWeight.status = 0;
    } else if (value < 40 || value > 200) {
      data.value.goalWeight.status = 1;
    } else {
      data.value.goalWeight.status = 2;
      UpdateField("goalWeight", value);
    }
  } else if (field === "goalBf") {
    if (!value) {
      data.value.goalBf.status = 0;
    } else if (value < 5 || value > 30) {
      data.value.goalBf.status = 1;
    } else {
      data.value.goalBf.status = 2;
      UpdateField("goalBf", value);
    }
  }
};
// health_data emit
const UpdateField = (field: string, value: number) => {
  emit("update-field", { field, value });
};
// view_data emit
watch(allowence, () => {
  if (allowence.value) {
    emit("update-right", { field: "max", value: 6 });
  } else {
    emit("update-right", { field: "max", value: 5 });
  }
});
</script>

<template>
  <div class="w">
    <number_input :data="data.goalWeight" field="goalWeight" @infoInput="checkInfo" />
    <number_input :data="data.goalBf" field="goalBf" @infoInput="checkInfo" />
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
}
</style>
