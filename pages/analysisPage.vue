<script setup lang="ts">
import endUp from "./signUpInFolder/endUp.vue";
import { useAssetStore } from "../stores/index";
const assetStore = useAssetStore();
setTimeout(() => {
  console.warn(assetStore.assets.length)
}, 2000);
</script>

<template>
  <div class="screen analysis">
    <div class="list">
      <div class="item" v-for="value in assetStore.assets">
        {{ value }}
      </div>
    </div>
    <endUp />
  </div>
</template>

<style scoped lang="scss">
.analysis {
  padding: var(--mm);
  overflow-y: scroll;
}
.analysis::-webkit-scrollbar {
  display: none;
}
</style>
