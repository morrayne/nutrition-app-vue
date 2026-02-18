<script setup lang="ts">
import router from '../utils/router';

</script>

<template>
  <div class="r">
    <p class="title-404">{{ '404 bad gateway :(' }}</p>
    <div class="con" @click="router.push('/settings')">go somewhere</div>
  </div>
</template>

<style scoped lang="scss">
.r {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  .title-404 {
    width: 100%;
    font-size: 1.5rem;
    text-align: left;
  }

  .con {
    width: 100%;
    height: 4rem;
    background: var(--back-b);
  }
}
</style>
