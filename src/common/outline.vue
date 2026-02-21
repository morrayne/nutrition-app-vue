<script setup lang="ts">
// MAIN IMPORTS
// vue & store
import { useUserStore } from "../../stores/useUserStore";
import headerComponent from "./header_navigation.vue";
import { ref, onMounted, onUnmounted } from "vue";
const userStore = useUserStore();

// CONTENT
// vars
const frame_array = ["#c3e0b9", "#b1a8e1", "#ece0ef"];
const currentColor = ref(frame_array[0]);
const isMobile = ref(window.innerWidth <= 540);

// functions
const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * frame_array.length);
  if (frame_array[randomIndex]) {
    return frame_array[randomIndex];
  } else {
    return "#c3e0b9";
  }
};

// handle resize
const handleResize = () => {
  isMobile.value = window.innerWidth <= 540;
};

onMounted(() => {
  currentColor.value = getRandomColor();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <!-- Мобильная версия (без обертки) -->
  <div v-if="isMobile" class="mobile-content">
    <slot></slot>
  </div>

  <!-- Десктопная версия (с рамкой) -->
  <div v-else class="edge" :style="{ border: `solid 0.5rem ${currentColor}` }">
    <div class="frame">
      <div class="imaginary-head">
        <div class="layer-1">
          <div class="island"></div>
        </div>
        <div class="layer-2">
          <p>wapp</p>
          <p>22:16</p>
        </div>
      </div>
      <headerComponent
        v-if="userStore.userData.config.first_login"
      ></headerComponent>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.edge {
  max-width: 400px;
  aspect-ratio: 8 / 16;
  flex: 1;
  outline: solid 0.125rem #00000050;
  border-radius: 3rem;

  .frame {
    height: 100%;
    outline: solid 0.2rem #00000050;
    border: solid 0.375rem #000000;
    background: var(--back-a);
    border-radius: 2.5rem;
    display: flex;
    flex-direction: column;

    .imaginary-head {
      height: 2rem;
      border-radius: 2rem 2rem 0 0;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      .layer-1,
      .layer-2 {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;

        .island {
          aspect-ratio: 6 / 1;
          height: 1.25rem;
          padding: 0.25rem;
          border-radius: 1rem;
          background: #000;
        }
      }

      .layer-1 {
        justify-content: center;
        align-items: center;
      }

      .layer-2 {
        justify-content: space-between;
        align-items: center;
        padding: 0.25rem 1rem 0;
        font-size: 0.75rem;
      }
    }

    .content {
      height: calc(100% - 2rem);
      border-radius: 0 0 2rem 2rem;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
