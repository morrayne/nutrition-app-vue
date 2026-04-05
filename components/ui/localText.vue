<script setup lang="ts">
const props = defineProps<{
  text: string;
  size?: string;
}>();
</script>

<template>
  <p class="local-text" :style="{ '--text': `var(--${props.text})`, fontSize: `var(--size-${props.size})` }"></p>
</template>

<style scoped lang="scss">
.local-text {
  font-size: var(--size-m);
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.local-text::after {
  content: var(--text);
}
</style>
