<script setup lang="ts">
const props = defineProps<{
  color: string
  rotate: number
}>()
</script>

<template>
  <svg width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :style="{ rotate: `${props.rotate}deg` }">
    <path 
      :stroke="`var(--${props.color})`" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="1.5" 
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
</template>