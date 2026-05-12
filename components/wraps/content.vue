<script setup lang="ts">
import { ref, watch } from "vue";
import { useAuthStore } from "../../stores/useAuthStore";
const authStore = useAuthStore();
const showNavigation = ref<boolean>(authStore.isAuthenticated);
import navigation from "../../components/navigation/common.vue";

watch(
  [authStore],
  () => {
    showNavigation.value = authStore.isAuthenticated;
  },
  { deep: true },
);
</script>

<template>
  <div class="w-100 h-100 wrap">
    <div class="w-100 h-100 content-wrap">
      <div class="w-100 h-100 j-c pos-r content">
        <navigation v-if="showNavigation" />
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  max-width: 1920px;
  max-height: 920px;
  min-height: 100%;
  .content-wrap {
    padding: 1rem;
    .content {
      padding: 1rem;
      background: var(--main-background);
      border: solid 1px var(--ex-background);
      border-radius: 2rem;
    }
  }
}

@media (max-width: 768px) {
  .content-wrap {
    padding: 0 !important;
    .content {
      padding: 1rem;
      border-radius: 0 !important;
      border: none !important;
    }
  }
}
</style>
