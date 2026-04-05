<script setup lang="ts">
const props = defineProps<{
  color: string
  rotate: number
}>()
</script>

<template>
  <svg width="100%" height="100%" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" :style="{ rotate: `${props.rotate}deg` }">
    <path :fill="`var(--${props.color})`" d="M609.408 149.376L277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0a30.59 30.59 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.59 30.59 0 0 0 0-42.688a29.12 29.12 0 0 0-41.728 0" />
  </svg>
</template>