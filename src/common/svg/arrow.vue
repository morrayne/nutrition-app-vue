<script setup lang="ts">
const props = defineProps<{
  color: string
  rotate: number
}>()
</script>

<template>
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" :style="{rotate: `${props.rotate}deg`}">
    <path d="M14.5 17L9.5 12L14.5 7" :stroke="'var(--' + props.color + ')'" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<style scoped lang="scss">
svg {
  padding-right: 2px;
}

</style>
