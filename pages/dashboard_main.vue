<script setup lang="ts">
import week_days from "./dashboard/week_days.vue";
import month_days from "./dashboard/month_days.vue";
</script>

<template>
  <div class="dash">
    <week_days></week_days>
    <month_days></month_days>
  </div>
</template>

<style scoped lang="scss">
.dash {
  width: 100%;
  height: 100%;
  padding: 0.5rem 0.75rem 0.75rem;
  background: var(--back-a);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
