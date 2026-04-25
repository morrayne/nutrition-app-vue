<script setup lang="ts">
import { computed } from 'vue';

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import type { tSwitcherHorizontal } from "../../appSettings/types";

const props = defineProps<tSwitcherHorizontal & { modelValue?: string | number }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const active = computed(() => {
  return props.modelValue === props.data.on;
});
const handleSwitch = () => {
  const newValue = active.value ? props.data.off : props.data.on;
  emit('update:modelValue', newValue);
};
</script>

<template>
  <div class="solid-wrap switcher-horizontal">
    <div class="wh-100 center">
      <p class="title">{{ t(props.title) }}</p>
      <div class="item bounce" :style="{ background: active ? 'var(--focus)' : 'var(--ex-background-tr)' }" @click="handleSwitch">
        <div :style="{flex: active ? '1' : '0'}"></div>
        <div class="runner"></div>
        <div :style="{flex: active ? '0' : '1'}"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.switcher-horizontal {
  width: 100%;
  .center {
    justify-content: space-between;
    .title {
      font-size: var(--size-m);
      font-weight: 400;
    }
    .item {
      width: calc(2 * var(--size-m));
      height: 80%;
      padding: 0.25rem;
      border-radius: 2rem;
      cursor: pointer;
      .runner {
        height: 100%;
        aspect-ratio: 1 / 1;
        border-radius: 2rem;
        background: var(--main-background);
      }
    }
  }
}
</style>
