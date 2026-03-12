<script setup lang="ts">
import { ref } from "vue";
import weekdays from "./home/weekdays.vue";
import dynamic_island from "@/common/dynamic.vue";
const err = ref("");
</script>

<template>
  <div class="home">
    <dynamic_island :text="err" />
    <weekdays />
  </div>
</template>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
  padding: 2.5rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--back-a);
  position: relative;
  overflow: hidden;
}
</style>
