<script setup lang="ts">
import type { Component } from "vue"; 
const props = defineProps<{
  type: "text" | "svg";
  title?: string;
  svg?: Component;
}>();
</script>

<template>
  <div class="glass" v-if="type === 'text'">
    <p class="text" :style="`--item-text: var(--${props.title})`"></p>
  </div>
  <div class="glass glass-svg" v-else>
    <component :is="props.svg" :rotate="0" :color="'signup-main-text'" />
  </div>
</template>

<style scoped>
.glass {
  width: 100%;
  height: 100%;
  border-radius: 2rem;
  border: solid 1px var(--signup-main-border);
  box-shadow: var(--box-shadow);
  backdrop-filter: blur(0.5rem);
  display: flex;
  align-items: center;
  justify-content: center;

  .text::after {
    font-size: var(--mm);
    content: var(--item-text);
  }
}

.glass-svg {
  padding: 0.5rem;
}
</style>
