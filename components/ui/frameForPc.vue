<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import navigation from "./navigation.vue";
import { useRoute } from "vue-router";

const renderStyle = ref(0);
const effectiveWidth = ref(window.innerWidth);

const updateEffectiveWidth = () => {
  // Учитываем масштаб страницы
  const zoom = window.devicePixelRatio;
  const physicalWidth = window.innerWidth;
  const logicalWidth = physicalWidth / zoom;
  
  effectiveWidth.value = logicalWidth;
  
  if (logicalWidth < 540) renderStyle.value = 0;
  else if (logicalWidth <= 1440) renderStyle.value = 1;
  else renderStyle.value = 2;
  
  console.log(`Physical: ${physicalWidth}, Logical: ${logicalWidth}, Zoom: ${zoom}, Style: ${renderStyle.value}`);
};

onMounted(() => {
  updateEffectiveWidth();
  window.addEventListener('resize', updateEffectiveWidth);
  window.addEventListener('load', updateEffectiveWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateEffectiveWidth);
  window.removeEventListener('load', updateEffectiveWidth);
});

const route = useRoute();
const showNavigation = computed(() => {
  return route.meta!.showNavigation;
});
</script>

<template>
  <!-- <div class="inner-content"></div> -->

  <!-- pc -->
  <div v-if="renderStyle" class="frame">
    <div class="black-outline">
      <div class="back-screen">
        <div class="island-wrap"><div class="island"></div></div>
        <div class="content">
          <navigation v-if="showNavigation" />
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
  
  <!-- tablet -->
  <div v-else class="no-frame">
    <div class="border-blur"></div>
    <div class="content">
      <navigation v-if="showNavigation" />
      <slot></slot>
    </div>
  </div>
  <!-- mobile -->

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
      overflow: hidden;

      .island-wrap {
        width: calc(100% - 0.25rem);
        height: 3.5rem;
        padding: 1rem 0;
        justify-content: center;
        pointer-events: none;
        position: absolute;
        z-index: 2;
        top: 0;

        .island {
          width: 6rem;
          height: 100%;
          pointer-events: all;
          background: #000000;
          border-radius: 1rem;
          cursor: pointer;
        }

        .island:hover {
          transform: scale(1.05);
        }

        .island:active {
          transform: scale(0.95);
        }
      }
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
  // border-radius: 2.875rem;
  overflow: hidden;
}
</style>
