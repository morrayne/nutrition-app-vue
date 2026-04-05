<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import navigation from "./navigation.vue";
import { useRoute } from "vue-router";
import { useDeviceStore } from "../../stores/main/useDeviceStore";

const deviceStore = useDeviceStore();
const isMobile = ref(false);

onMounted(() => {
  isMobile.value = deviceStore.width <= 540;
});

const route = useRoute();
const showNavigation = computed(() => {
  return route.meta!.showNavigation;
});
</script>

<template>
  <div v-if="!isMobile" class="frame">
    <div class="black-outline">
      <div class="back-screen">
        <div class="content">
          <navigation v-if="showNavigation" />
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="no-frame">
    <div class="border-blur"></div>
    <div class="content">
      <navigation v-if="showNavigation" />
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.frame {
  width: fit-content;
  padding: 0.375rem;
  border-radius: 3.5rem;
  border: solid 3px #00000020;
  background: var(--frame);
  position: relative;
  transition: 0.2s;

  .black-outline {
    width: 320px;
    aspect-ratio: 20 / 39;
    background: #000000;
    outline: solid 3px #ffffff80;
    padding: 0.25rem;
    border-radius: 3.125rem;
    display: flex;
    flex-direction: column;
    position: relative;

    .back-screen {
      height: 100%;
      background: var(--html-background);
      border-radius: 2.875rem;
    }
  }
}
.no-frame {
  width: 100%;
  height: 100%;
  background: var(--html-background);
  position: relative;
}
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 2.875rem;
  overflow: hidden;
}
</style>
