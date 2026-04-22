<script setup lang="ts">
// import iridescence from "../vueBits/iridescence.vue";
</script>

<template>
  <div class="wrap">
    <div class="content-wrap">
      <div class="wrap">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  max-width: 1920px;
  width: 100%;
  max-height: 1080px;
  height: 100%;
  .content-wrap {
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    position: relative;
    z-index: 2;
    .wrap {
      width: 100%;
      height: 100%;
      background: var(--main-background);
      border: solid 1px var(--sub-background);
      box-shadow: var(--box-shadow);
      border-radius: 2rem;
      overflow: hidden;
    }
  }
}
</style>
