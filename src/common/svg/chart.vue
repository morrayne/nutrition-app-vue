<script setup lang="ts">
const props = defineProps<{
  color: string
  rotate: number
  scale: number
}>()
</script>

<template>
  <svg width="100%" height="100%" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" :style="{ rotate: `${props.rotate}deg`, scale: props.scale }">
    <path :fill="props.color" d="M448 68.48v64.832A384.128 384.128 0 0 0 512 896a384.13 384.13 0 0 0 378.688-320h64.768A448.128 448.128 0 0 1 64 512A448.13 448.13 0 0 1 448 68.48"/>
    <path :fill="props.color" d="M576 97.28V448h350.72A384.064 384.064 0 0 0 576 97.28M512 64V33.152A448 448 0 0 1 990.848 512H512z"/>
  </svg>
</template>
