<script setup lang="ts">
interface props_type {
  direction: boolean;
  height: number;
}
const props = defineProps<props_type>();
</script>

<template>
  <div class="dots">
    <div :class="`${props.direction ? 'grad ontop' : 'grad onbot'}`" :style="{height: `${props.height}%`}"></div>
    <div class="item" v-for="value in (16 * 12 - 1)">
        <div class="round"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dots {
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  position: relative;

  .grad {
    width: 100%;
    position: absolute;
    background: linear-gradient(var(--back-a), transparent);
  }

  .ontop {
    top: 0;
    rotate: 0;
  }

  .onbot {
    bottom: 0;
    rotate: 180deg;
  }

  .item {
    width: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;

    .round {
      width: 4px;
      height: 4px;
      background: var(--back-b);
      border-radius: 2px;
    }
  }
}
</style>
