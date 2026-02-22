<script setup lang="ts"></script>

<template>
  <div class="month">
    <div class="item" v-for="value in 7">
      <p>{{ value }}</p>
      <p>{{ value }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.month {
  width: 100%;
  height: fit-content;
  display: grid;
  grid-template-columns: repeat((7, 1fr));
  gap: 0.375rem;

  .item {
    width: 100%;
    background: var(--back-b);
    padding: 0.5rem 0;
    border-radius: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    p {
        text-align: center;
    }
  }
}
</style>
