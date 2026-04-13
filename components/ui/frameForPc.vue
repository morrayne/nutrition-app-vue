<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import navigation from "./navigation.vue";
import { useRoute } from "vue-router";

const renderStyle = ref(0);
const effectiveWidth = ref(document.documentElement.clientWidth);

const updateEffectiveWidth = () => {
  const htmlWidth = document.documentElement.clientWidth;
  effectiveWidth.value = htmlWidth;
  if (htmlWidth < 540) renderStyle.value = 0;
  else if (htmlWidth <= 1440) renderStyle.value = 1;
  else renderStyle.value = 2;
  console.log("html width:", htmlWidth, "renderStyle:", renderStyle.value);
};

onMounted(() => {
  updateEffectiveWidth();
  window.addEventListener("resize", updateEffectiveWidth);
  window.addEventListener("load", updateEffectiveWidth);
});
onUnmounted(() => {
  window.removeEventListener("resize", updateEffectiveWidth);
  window.removeEventListener("load", updateEffectiveWidth);
});

const route = useRoute();
const showNavigation = computed(() => {
  return route.meta?.showNavigation === true;
});
</script>

<template>
  <!-- pc -->
  <div class="pc-wrap" v-if="renderStyle === 2">
    <div class="pc">
      <div class="max-wrap">
        <navigation v-if="showNavigation" />
        <div class="island-wrap"><div class="island"></div></div>
        <slot />
      </div>
    </div>
  </div>
  <!-- tablet -->
  <div class="tablet-wrap" v-if="renderStyle === 1">
    <div class="tablet">
      <div class="max-wrap">
        <navigation v-if="showNavigation" />
        <div class="island-wrap"><div class="island"></div></div>
        <slot />
      </div>
    </div>
  </div>
  <!-- phone -->
  <div class="phone-wrap" v-if="renderStyle === 0">
    <div class="phone">
      <div class="max-wrap">
        <navigation v-if="showNavigation" />
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.pc-wrap {
  max-width: 1440px;
  width: 100%;
  max-height: 800px;
  height: 100%;
  padding: 0.5rem;
  border-radius: 3.75rem;
  border: solid 0.125rem #00000020;
  background: var(--frame);
  position: relative;
  .pc {
    width: 100%;
    aspect-ratio: 20 / 39;
    background: #000000;
    outline: solid 3px #ffffff80;
    padding: 0.25rem;
    border-radius: 3.25rem;
    justify-content: center;
    .max-wrap {
      width: 100%;
      height: 100%;
      border-radius: 3rem;
      justify-content: center;
      overflow: hidden;
      position: relative;
      background: var(--main-background);
      .island-wrap {
        width: calc(100% - 0.25rem);
        height: 3.5rem;
        padding: 1rem 0;
        justify-content: center;
        pointer-events: none;
        position: absolute;
        z-index: 5;
        top: 0;
        left: 0;
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

// tablet
.tablet-wrap {
  padding: 0.5rem;
  border-radius: 3.75rem;
  border: solid 0.125rem #00000020;
  background: var(--frame);
  position: relative;
  .tablet {
    width: 360px;
    aspect-ratio: 20 / 39;
    background: #000000;
    outline: solid 3px #ffffff80;
    padding: 0.25rem;
    border-radius: 3.25rem;
    flex-direction: column;
    position: relative;
    .max-wrap {
      width: 100%;
      max-width: 720px;
      height: 100%;
      border-radius: 3rem;
      overflow: hidden;
      position: relative;
      background: var(--main-background);
      .island-wrap {
        width: calc(100% - 0.25rem);
        height: 3.5rem;
        padding: 1rem 0;
        justify-content: center;
        pointer-events: none;
        position: absolute;
        z-index: 5;
        top: 0;
        left: 0;
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

// phone
.phone-wrap {
  width: 100vw;
  height: 100vh;
  .phone {
    width: 100%;
    height: 100%;
    .max-wrap {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
      background: var(--main-background);
    }
  }
}
</style>
