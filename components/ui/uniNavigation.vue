<script setup lang="ts">
import { ref, computed } from "vue";
import glass from "../wraps/glass.vue";
import type { tNavigationItem } from "../../appSettings/types";

const props = defineProps<{
  modelValue: number;
  left: tNavigationItem[];
  right: tNavigationItem;
}>();
const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const active = ref<number>(props.modelValue);
const scale = ref<number>(1);

const styleGlass = {
  height: "5rem",
  position: "absolute",
  borderRadius: "40px",
  top: 0,
  left: 0,
};

const handleClick = (data: number) => {
  if (data !== active.value) {
    scale.value = 1.2;
    setTimeout(() => {
      scale.value = 1;
    }, 120);
  }
  active.value = data;
  emits('update:modelValue', active.value);
};

const runnerStyle = computed(() => ({
  left: active.value !== -1 ? `calc(${active.value} * 5.5rem + 0.5rem)` : `calc(100% + 1.5rem)`,
  transform: `scale(${scale.value})`
}));
</script>

<template>
  <div class="uni-navigation-wrap">
    <div class="uni-navigation">
      <div class="left"> 
        <glass :style="styleGlass" />
        <div class="runner" :style="runnerStyle"></div>
        <div class="items-wrapper">
          <div class="item bounce" v-for="item in props.left" :key="item.index" @click="handleClick(item.index)">
            <div class="svg-wrap">
              <component :is="item.svg" :color="active === item.index ? 'var(--focus)' : 'var(--sub-color)'" :rotate="0" />
            </div>
            <p :style="{ color: active === item.index ? 'var(--focus)' : 'var(--sub-color)' }">
              {{ $t(item.title) }}
            </p>
          </div>
        </div>
      </div>
      <div class="right">
        <glass :style="styleGlass" />
        <div class="items-wrapper">
          <div class="item bounce" @click="handleClick(-1)">
            <div class="svg-wrap">
              <component :is="props.right.svg" :color="active === -1 ? 'var(--focus)' : 'var(--sub-color)'" :rotate="0" />
            </div>
            <p :style="{ color: active === -1 ? 'var(--focus)' : 'var(--sub-color)' }"> {{ $t(props.right.title) }} </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.uni-navigation-wrap {
  width: 100%;
  justify-content: center;
  position: absolute;
  top: 1rem;
  // bottom: 1rem;
  left: 0;
  z-index: 3;
  .uni-navigation {
    height: 5rem;
    gap: 1rem;
    position: relative;
    .left, .right {
      height: 100%;
      position: relative;
      .runner {
        width: 6rem;
        height: 4rem;
        top: 0.5rem;
        position: absolute;
        background: var(--sub-background);
        opacity: 0.9;
        border-radius: 2rem;
        scale: 1;
        z-index: 2; 
        pointer-events: none;
      }
      .items-wrapper {
        position: relative;
        display: flex;
        gap: 0.5rem;
        z-index: 3;
        .item {
          width: 5rem;
          height: 4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 2rem;
          .svg-wrap {
            width: 1.5rem;
            height: 1.5rem;
          }
          p {
            font-weight: 400;
            font-size: var(--size-xs);
          }
        }
      }
    }
    .left {
      padding: 0.5rem 1rem;
      .runner {
        left: 0.5rem;
      }
    }
    .right {
      padding: 0.5rem 1rem;
    }
  }
}

@media (max-width: 1440px) {
  .uni-navigation {
    scale: 0.9;
  }
}
@media (max-width: 1024px) {
  .uni-navigation {
    scale: 0.8;
  }
}
@media (max-width: 768px) {
  .uni-navigation {
    scale: 0.7;
  }
}
@media (max-width: 640px) {
  .uni-navigation {
    scale: 0.6;
  }
}
@media (max-width: 480px) {
  .uni-navigation {
    scale: 0.5;
  }
}
</style>