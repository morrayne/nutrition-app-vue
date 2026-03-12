<script setup lang="ts">
import router from "../../app_settings/router";
import meal from "../../public/svg/meal.vue";
import home from "../../public/svg/home.vue";
import settings from "../../public/svg/settings.vue";
import train from "../../public/svg/train.vue";
import reshape from "../../public/svg/reshape.vue";
const data = [
  { title: "", route: "/home", svg: home },
  { title: "", route: "/meal", svg: meal },
  { title: "", route: "/train", svg: train },
  { title: "", route: "/reshape", svg: reshape },
  { title: "", route: "/account", svg: settings },
];
</script>

<template>
  <div class="navigation">
    <div class="item" v-for="value in data" @click="router.push(value.route)">
      <component :is="value.svg" :color="'var(--text-b)'" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.navigation {
  width: calc(100% - 2rem);
  height: 4rem;
  padding: 0.5rem 0.75rem;
  border-radius: 1.5rem;
  border: solid 1px var(--liquid-glass-border);
  background: var(--back-a-half);
  box-shadow: var(--box-shadow);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: space-between;
  bottom: 1rem;
  left: 1rem;
  position: absolute;
  z-index: 3;

  .item {
    height: 100%;
    aspect-ratio: 1 / 1;
    border: solid 1px var(--liquid-glass-border);
    background: var(--back-a-half);
    border-radius: 0.5rem;
    box-shadow: var(--box-shadow);
    cursor: pointer;
  }
}
</style>
