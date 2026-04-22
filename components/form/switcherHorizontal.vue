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
  <div class="mini-wrap switcher-horizontal">
    <div class="switcher">
      <p>{{ t(props.title) }}</p>
      <div class="item bounce" :style="{background: active ? 'var(--focus)' : 'var(--ex-background)'}" @click="handleSwitch">
        <div class="gap" :style="{flex: active ? '1' : '0'}"></div>
        <div class="runner"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.switcher-horizontal {
  width: 100%;
  .switcher {
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    .item {
      width: calc(2.25 * var(--size-s));
      height: calc(1.25 * var(--size-s));
      padding: 0.125rem;
      background: var(--focus);
      border-radius: 1rem;
      cursor: pointer;
      .gap {
        flex: 1;
      }
      .runner {
        height: 100%;
        aspect-ratio: 1 / 1;
        background: var(--main-background);
        border-radius: 1rem;
      }
    }
  }
}
</style>
