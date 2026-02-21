<script setup lang="ts">
// MAIN IMPORTS
// router
import { useRoute } from "vue-router";
import router from "../../app_settings/router";
const route = useRoute();

// CONTENT
// type
interface navItemType {
  route: string;
  css: string;
}
// vars
const isActive = (itemRoute: string) => { return route.path.includes(itemRoute) };
const navItemClick = (item: navItemType) => { router.push(item.route) };
const navArray = [
  {route: "dashboard", css: "dashboard"},
  {route: "menu", css: "menu"},
  {route: "reshape", css: "reshape"},
  {route: "account", css: "account"}
];
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
  padding: 0.35rem 0.5rem;
  border-bottom: solid 0.125rem var(--back-d);
  display: flex;
  justify-content: space-between;

  .header-li {
    font-size: 0.75rem;
    color: var(--text-b);
    padding: 0.35rem 1rem;
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
