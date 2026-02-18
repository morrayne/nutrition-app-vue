<script setup lang="ts">
// vue
import { computed } from "vue";
// router
import { useRoute } from "vue-router";
import router from "../../utils/router";

// type
interface navItemType {
  route: string;
  css: string;
}

// Текущий route
const route = useRoute();

// Массив навигации
const navArray = [
  {route: "intakes", css: "intakes"},
  {route: "menu", css: "menu"},
  {route: "health", css: "health"},
  {route: "settings", css: "settings"}
];

// Определяем активный пункт по текущему пути
const isActive = (itemRoute: string) => {
  return route.path.includes(itemRoute);
};

// Навигация
const navItemClick = (item: navItemType) => {
  router.push(item.route);
};
</script>

<template>
  <ul class="header-ul">
    <div v-for="navItem in navArray" :key="navItem.route" :class="['header-li', { active: isActive(navItem.route) }]" @click="navItemClick(navItem)" :style="{ '--nav-text': `var(--${navItem.css})` }">
      <p></p>
    </div>
  </ul>
</template>

<style scoped>
.header-ul {
  width: 100%;
  padding: 0.4rem 0.5rem;
  border-bottom: solid 0.125rem var(--back-d);
  display: flex;
  justify-content: space-between;

  .header-li {
    font-size: 0.75rem;
    color: var(--text-b);
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
  }
  .header-li p::after {
    content: var(--nav-text);
  }

  .active {
    background: var(--back-c);
    border-radius: 0.5rem;
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
