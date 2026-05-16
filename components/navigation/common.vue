<script setup lang="ts">
import { House, Apple, BicepsFlexed, Pill, UserRound } from "@lucide/vue";

const navigationArray = [
  { title: "home", svg: House, route: "/home" },
  { title: "meal", svg: Apple, route: "/meal" },
  { title: "sport", svg: BicepsFlexed, route: "/sport" },
  { title: "pill", svg: Pill, route: "/pill" },
  { title: "account", svg: UserRound, route: "/account" },
];

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import router from "../../appSettings/router";
const roundStyle = (data: string) => {
  let styles;
  if (data !== router.currentRoute.value.path) styles = { scale: 0, background: "transparent" };
  else styles = { scale: 1, background: "var(--ex-background)" };
  return { ...styles };
};

const handleNavigation = (data: string) => {
  setTimeout(() => {
    router.push(data);
  }, 10);
};
</script>

<template>
  <div class="navigation-wrap pos-a j-c a-c g-05">
    <div class="w-100 j-b s">
      <div class="navigation pos-r def-wrap">
        <div class="flex-c a-c pos-r navigation-item" v-for="(item, index) in navigationArray.slice(0, -1)" :key="index" @click="handleNavigation(item.route)">
          <div class="w-100 h-100 round" :style="roundStyle(item.route)"></div>
          <component :is="item.svg" color="var(--sub-color)" />
          <p class="w-100 j-c fs-xs fw-6">{{ t(item.title) }}</p>
        </div>
      </div>
      <div class="navigation def-wrap">
        <div class="flex-c a-c j-c pos-r navigation-item account-item" v-for="(item, index) in navigationArray.slice(-1)" :key="index" @click="handleNavigation(item.route)">
          <div class="w-100 h-100 round" :style="roundStyle(item.route)"></div>
          <component :is="item.svg" color="var(--sub-color)" />
          <p class="w-100 j-c fs-xs fw-6">{{ t(item.title) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.navigation-wrap {
  width: calc(100% - 2rem);
  bottom: 1rem;
  left: 1rem;
  z-index: 3;
  .s {
    max-width: 1080px;
    .navigation {
      width: fit-content;
      backdrop-filter: blur(0.5rem);
      border-radius: 3rem;
      padding: 0.25rem;
      .navigation-item {
        width: 5rem;
        height: 4rem;
        border-radius: 3rem;
        padding: 0.5rem;
        cursor: pointer;
        .round {
          border-radius: 3rem;
          position: absolute;
          background: var(--ex-background);
          z-index: -1;
          top: 0;
          left: 0;
        }
        svg {
          width: 100%;
        }
      }
      .navigation-item:hover {
        scale: 1.075;
      }
      .navigation-item:active {
        scale: 0.925;
      }
      .account-item {
        width: 6rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .navigation {
    padding: 0.375rem 0.5rem;
  }
  .navigation {
    padding: 0.25rem;
    .navigation-item {
      width: 3.5rem !important;
      height: 3rem !important;
      border-radius: 3rem;
      padding: 0.5rem;
    }
    .account-item {
      width: 4.5rem;
    }
  }
}
</style>
