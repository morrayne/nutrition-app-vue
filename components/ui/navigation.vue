<script setup lang="ts">
import router from "../../appSettings/router";
import type { Component } from "vue";

import notebook from "@/svg/notebook.vue";
import chart from "@/svg/chart.vue";
import apple from "@/svg/apple.vue";
import edit from "@/svg/edit.vue";
import user from "@/svg/user.vue";

interface tNav {
  title: string;
  route: string;
  svg: Component;
  scale?: number;
}
const data: tNav[] = [
  { title: "home", route: "/home", svg: notebook },
  { title: "meal", route: "/meal", svg: apple },
  { title: "analysis", route: "/analysis", svg: chart, scale: 0.9 },
  { title: "reshape", route: "/reshape", svg: edit },
  { title: "account", route: "/account", svg: user },
];
</script>

<template>
  <div class="navigation">
    <div class="wrap">
      <div class="item" v-for="(value, index) in data" :key="index" @click="router.push(value.route)">
        <component :is="value.svg" :scale="value.scale || 1" color="sub-color" :rotate="0" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navigation {
  width: calc(100% - calc(3 * var(--newrem)));
  height: calc(3.5 * var(--newrem));
  padding: calc(0.25 * var(--newrem));
  position: absolute;
  z-index: 2;
  gap: calc(0.5 * var(--newrem));
  bottom: calc(1.5 * var(--newrem));
  left: calc(1.5 * var(--newrem));

  .wrap {
    width: 100%;
    height: 100%;
    justify-content: space-between;
    backdrop-filter: blur(2px);
    border: solid 1px var(--ex-background);
    border-radius: calc(2 * var(--newrem));
    padding: calc(0.25 * var(--newrem)) calc(0.75 * var(--newrem));

    .item {
      height: 100%;
      aspect-ratio: 1 / 1;
      padding: 0.25rem;
      border-radius: var(--newrem);
      background: var(--sub-background);
      border: solid 1px var(--ex-background);
      cursor: pointer;
    }
  }
}
</style>
