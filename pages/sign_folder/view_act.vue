<script setup lang="ts">
// IMPORT
// ui & type
import ui_select from "@/common/form/ui_select.vue";
import type { select_type } from "@/common/form/ui_select.vue";

// CONTENT
// emit
const emit = defineEmits<{
  (e: "change-activity", value: string | number): void;
}>();
// avaliable activity levels
const activity: select_type[] = [
  { text: "activity-level-1", value: 1.15 },
  { text: "activity-level-2", value: 1.3 },
  { text: "activity-level-3", value: 1.45 },
  { text: "activity-level-4", value: 1.6 },
  { text: "activity-level-5", value: 1.75 },
  { text: "activity-level-6", value: 1.9 },
];

// FUNCTION
// return activity
const return_activity = (data: string | number) => {
  emit("change-activity", data);
}
</script>

<template>
  <div class="theme-activity">
    <p class="activity-level"></p>
    <ui_select :options="activity" @select="return_activity" />
  </div>
</template>

<style scoped lang="scss">
.theme-activity {
  width: 100%;
  display: flex;
  flex-direction: column;

  .activity-level {
    font-size: var(--mm);
    margin-left: 1.5rem;
    margin-top: 0.5rem;
    color: var(--text-b);
  }
  
  .activity-level::after {
    content: var(--activity-level);
  }
}
</style>
