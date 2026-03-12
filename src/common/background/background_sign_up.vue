<script setup lang="ts">
import dots from "../../src/common/background/dots.vue";
import nets from "../../src/common/background/nets.vue";
</script>

<template>
  <div class="background">
    <dots :direction="false" :height="100" />
    <nets :direction="true" :height="100" />
  </div>
</template>

<style scoped lang="scss">
.background {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
