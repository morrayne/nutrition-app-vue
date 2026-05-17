<script setup lang="ts">
import { ref, watch } from "vue";

import { useAuthStore } from "../../stores/useAuthStore";
const authStore = useAuthStore();

const showNavigation = ref<boolean>(authStore.isAuthenticated);
import navigation from "../../components/navigation/common.vue";

watch(authStore, () => {
  showNavigation.value = authStore.isAuthenticated;
}, { deep: true });
</script>

<template>
  <div class="w-100 h-100 a">
    <div class="w-100 h-100 pad-100 pos-r b">
      <div class="w-100 h-100 pad-100 pos-r jus-c c">
        <navigation v-if="showNavigation" />
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.a {
  max-width: 1920px;
  max-height: 920px;
  .c {
    background: var(--main-background);
    border: solid 1px var(--ex-background);
    border-radius: 2rem;
  }
}

@media (max-width: 768px) {
  .b {
    padding: 0 !important;
    .c {
      border-radius: 0 !important;
      border: none !important;
    }
  }
}
</style>
