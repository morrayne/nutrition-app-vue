<script setup lang="ts">
import home from "@/common/svg/home.vue";
import meal from "@/common/svg/meal.vue";
import train from "@/common/svg/train.vue";
import reshape from "@/common/svg/reshape.vue";
import settings from "@/common/svg/settings.vue";
const data = [
  { title: "", route: "/home", svg: home },
  { title: "", route: "/meal", svg: meal },
  { title: "", route: "/train", svg: train },
  { title: "", route: "/reshape", svg: reshape },
  { title: "", route: "/account", svg: settings },
];
</script>

<template>
  <div class="navigation"></div>
</template>

<style scoped lang="scss">
.navigation {
  width: calc(100% - calc(2 * var(--mm)));
  height: 3rem;
  background: #000;
  position: absolute;
  bottom: var(--mm);
  left: var(--mm);
}
</style>
