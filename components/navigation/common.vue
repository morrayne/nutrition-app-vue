<script setup lang="ts">
import { House, Apple, BicepsFlexed, Pill, UserRound } from "@lucide/vue";
import router from "../../appSettings/router";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const navigationArray = [
  { title: "home", svg: House, route: "/home" },
  { title: "food", svg: Apple, route: "/meal" },
  { title: "sport", svg: BicepsFlexed, route: "/sport" },
  { title: "meds", svg: Pill, route: "/pill" },
  { title: "account", svg: UserRound, route: "/account" },
];

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
  <div class="a pos-a jus-c ali-c">
    <div class="w-100 max-w-1440 jus-sb ali-c">
      <div class="main b">
        <div class="flex-c pos-r ali-c pad-50 c" v-for="(item, index) in navigationArray.slice(0, -1)" :key="index" @click="handleNavigation(item.route)">
          <div class="w-100 h-100 pos-a top-0 left-0 d" :style="roundStyle(item.route)"></div>
          <component :is="item.svg" color="var(--sub-color)" />
          <p class="w-100 jus-c text-s">{{ t(item.title) }}</p>
        </div>
      </div>
      <div class="main b">
        <div class="flex-c pos-r ali-c pad-50 c one" v-for="(item, index) in navigationArray.slice(-1)" :key="index" @click="handleNavigation(item.route)">
          <div class="w-100 h-100 pos-a top-0 left-0 d" :style="roundStyle(item.route)"></div>
          <component :is="item.svg" color="var(--sub-color)" />
          <p class="w-100 jus-c text-s">{{ t(item.title) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.a {
  width: calc(100% - 2rem);
  bottom: 1rem;
  left: 1rem;
  z-index: 3;
  .b {
    width: fit-content;
    padding: 0.25rem;
    border-radius: 4rem;
    .c {
      width: 6rem;
      height: 4.5rem;
      cursor: pointer;
      .text-s {
        font-weight: 500;
      }
    }
    .one {
      width: 7rem;
    }
    .d {
      border-radius: 4rem;
      background: var(--ex-background);
      z-index: -1;
    }
    svg {
      width: 100%;
    }
  }
}

@media (max-width: 1280px) {
  .c {
    width: 5rem !important;
    height: 4rem !important;
  }
  .one {
    width: 6rem !important;
  }
}
@media (max-width: 640px) {
  .c {
    width: 4rem !important;
    height: 3.25rem !important;
  }
  .one {
    width: 4.5rem !important;
  }
}
</style>
