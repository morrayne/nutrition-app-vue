<script setup lang="ts">
import router from "../../../appSettings/router";
import backArrow from "@/svg/backArrow.vue";
import user from "@/svg/user.vue";

const props = defineProps<{
  modelValue: number;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();
const increment = () => {
  emits("update:modelValue", props.modelValue + 1);
};
const decrement = () => {
  emits("update:modelValue", props.modelValue - 1);
};
</script>

<template>
  <div class="control-wrap">
    <div class="control">
      <div class="round" @click="decrement">
        <backArrow color="main-color" :rotate="0" />
      </div>
      <div class="wider" @click="increment"></div>
      <div class="round" @click="router.push('/signin')">
        <user color="main-color" :rotate="0" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.control-wrap {
  width: calc(100% - calc(3 * var(--newrem)));
  justify-content: center;
  position: absolute;
  bottom: calc(1.5 * var(--newrem));
  left: calc(1.5 * var(--newrem));
  z-index: 2;
  .control {
    max-width: calc(720px - calc(3 * var(--newrem)));
    width: 100%;
    height: calc(3 * var(--newrem));
    gap: calc(0.5 * var(--newrem));
    .wider,
    .round {
      align-items: center;
      justify-content: center;
      padding: calc(0.5 * var(--newrem));
      border-radius: calc(3 * var(--newrem));
      backdrop-filter: blur(2px);
      background: #ffffff20;
      border: solid 1px var(--ex-background);
      cursor: pointer;
    }
    .wider:hover,
    .round:hover {
      transform: scale(1);
    }
    .wider:active,
    .round:active {
      transform: scale(0.9);
    }
    .round {
      height: 100%;
      aspect-ratio: 1 / 1;
    }
    .wider {
      font-weight: 700;
      flex: 1;
    }
    .wider::after {
      content: var(--continue);
    }
  }
}
</style>
