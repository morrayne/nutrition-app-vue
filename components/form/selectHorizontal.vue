<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import type { tSelect } from "../../appSettings/types";

const props = defineProps<tSelect & { modelValue?: string | number }>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

const selectedIndex = computed(() => {
  const index = props.data.opt.findIndex(item => item.worth === props.modelValue);
  return index >= 0 ? index : 0;
});
const runnerLeft = computed(() => {
  let left = '0.25rem'
  if (selectedIndex.value !== 0) {
    left = 'calc(50% - 0.25rem)';
  }
  return left
});

const selectOption = (worth: string | number) => {
  emits("update:modelValue", worth);
};
</script>

<template>
  <div class="select-horizontal">
    <p class="title" v-if="props.title" :style="{ fontSize: `var(--size-${props.st?.fontSize === 'm' ? 'l' : 'm'})` }">
      {{ t(props.title) }}
    </p>
    <p class="desc" v-if="props.desc" :style="{ fontSize: `var(--size-${props.st?.fontSize === 'm' ? 's' : 'xs'})` }">
      {{ t(props.desc) }}
    </p>
    <div class="solid-wrap prz-2">
      <div class="runner" :style="{ width: `calc(100% / ${props.data.opt.length})`, left: runnerLeft }"></div>
      <div class="item bounce" :class="{ active: props.modelValue === value.worth }" :style="{ width: `calc(100% / ${props.data.opt.length})` }" v-for="value in props.data.opt" :key="value.worth" @click="selectOption(value.worth)">
        <p :style="{ fontSize: `var(--size-${props.st?.fontSize || 'm'})` }">
          {{ t(value.title) }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.select-horizontal {
  width: 100%;
  flex-direction: column;
  .title {
    font-size: var(--size-l);
    font-weight: 500;
  }
  .desc {
    font-size: var(--size-m);
    font-weight: 400;
  }
  .solid-wrap {
    width: 100%;
    margin-top: 0.5rem;
    .runner {
      width: calc(50% - 0.5rem);
      height: calc(100% - 0.5rem);
      border-radius: 2rem;
      background: var(--ex-background-tr);
      position: absolute;
      top: 0.25rem;
      left: 0.25rem;
    }
    .item {
      width: 50%;
      justify-content: center;
      position: relative;
      z-index: 2;
      cursor: pointer;
    }
  }
}
</style>
