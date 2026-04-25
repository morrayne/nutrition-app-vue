<script setup lang="ts">
// import iridescence from "../vueBits/iridescence.vue";
</script>

<template>
  <div class="wh-100 wrap">
    <div class="wh-100 prz-2 content-wrap">
      <div class="wh-100 small-wrap">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  max-width: 1920px;
  max-height: 920px;
  .content-wrap {
    padding: 0.5rem;
    .small-wrap {
      background: var(---background);
      border: solid 1px var(--sub-background);
      box-shadow: var(--box-shadow);
      border-radius: 2rem;
      overflow: hidden;
    }
  }
}

@media (max-width: 768px) {
  .wrap .content-wrap {
    padding: 0;
    .small-wrap {
      border: none;
    }
  }
}
</style>
