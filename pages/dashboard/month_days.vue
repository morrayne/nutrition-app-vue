<script setup lang="ts"></script>

<template>
  <div class="month">
    <div class="item" v-for="value in 31"></div>
  </div>
</template>

<style scoped lang="scss">
.month {
  width: 100%;
  padding: 0.5rem;
  background: var(--back-b);
  border-radius: 0.5rem;
  display: grid;
  grid-template-columns: repeat((16, 1fr));
  gap: 0.25rem;

  .item {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 0.25rem;
    background: var(--text-a);
  }
}
</style>
