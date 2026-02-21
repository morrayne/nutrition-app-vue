<script setup lang="ts">
// MAIN IMPORTS
// vue & ui
import { ref, computed, watch } from "vue";
import switcher from "../../src/inputs/switcher.vue";
import number_input from "../../src/inputs/number_input.vue";


// CONTENT
// props & emits
const props = defineProps(["userData"]);
const emit = defineEmits(["update-field", "update-right"]);
// vars
const allowence = computed(() => data.value.age.status === 2 && data.value.height.status === 2);
const data = ref({
  gender: {
    name: "gender",
    value: "male",
    option1: "male",
    option2: "female",
  },
  age: {
    placeholder: "21 y.o.",
    status: 0,
  },
  height: {
    placeholder: "180 cm",
    status: 0,
  },
});

// FUNCTIONS
// health_data emit
const UpdateField = (field: string, value: any) => {
  emit("update-field", { field, value });
};
// information moderation
const checkInfo = (field: string, value: any) => {
  if (field === "gender") {
    data.value.gender.value = value;
    UpdateField("gender", value);
  } else if (field === "age") {
    const numValue = Number(value);
    if (!value || value === '') {
      data.value.age.status = 0;
    } else if (numValue < 14 || numValue > 100) {
      data.value.age.status = 1;
    } else {
      data.value.age.status = 2;
      UpdateField("age", numValue);
    }
  } else if (field === "height") {
    const numValue = Number(value);
    if (!value || value === '') {
      data.value.height.status = 0;
    } else if (numValue < 140 || numValue > 220) {
      data.value.height.status = 1;
    } else {
      data.value.height.status = 2;
      UpdateField("height", numValue);
    }
  }
};
// view_data emit
watch(allowence, () => {
  if (allowence.value) {
    emit("update-right", { field: "max", value: 4 });
  } else {
    emit("update-right", { field: "max", value: 3 });
  }
});
</script>

<template>
  <div class="w">
    <switcher :data="data.gender" field="gender" @infoInput="checkInfo" />
    <number_input :data="data.age" field="age" @infoInput="checkInfo" />
    <number_input :data="data.height" field="height" @infoInput="checkInfo" />
  </div>
</template>

<style scoped>
.w {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.w {
  padding: 1rem;
  position: relative;
}
</style>
