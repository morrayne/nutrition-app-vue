<script setup lang="ts">
import router from "../../../appSettings/router";
import type { Component } from "vue";
// 
import apple from "@/common/svg/apple.vue";
import edit from "@/common/svg/edit.vue";
import chart from "@/common/svg/chart.vue";
import user from "@/common/svg/user.vue";
import notebook from "../svg/notebook.vue";
// 
interface tNav {
  title: string;
  route: string;
  svg: Component;
  scale?: number
}
const data : tNav[] = [
  { title: "home", route: "/home", svg: notebook },
  { title: "meal", route: "/meal", svg: apple },
  { title: "analysis", route: "/analysis", svg: chart, scale: 0.9 },
  { title: "reshape", route: "/reshape", svg: edit },
  { title: "account", route: "/account", svg: user },
];

const handleNav = (data: tNav) => {
  router.push(data.route);
}
</script>

<template>
  <div class="navigation">
    <div class="item" v-for="value in data" @click="handleNav(value)">
      <component class="svg" :is="value.svg" color="var(--signup-sub-text)" :rotate="0" :scale="value.scale || 1" />  
      <div class="text" :style="`--item-text: var(--${value.title})`"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navigation {
  width: calc(100% - calc(3 * var(--mm)));
  padding: 0 var(--mm);
  height: 3rem;
  backdrop-filter: blur(6px);
  border: solid 1px var(--signup-main-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border-radius: 2rem;
  position: absolute;
  z-index: 3;
  bottom: calc(1.5 * var(--mm));
  left: calc(1.5 * var(--mm));

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    .svg {
      width: 1.75rem;
      height: 1.75rem;
    }

    .text {
      font-size: calc(0.5 * var(--mm));
      color: var(--signup-sub-text);
      text-align: center;
    }

    .text::after {
      content: var(--item-text);
    }
  }
}
</style>
