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
  return `calc(calc(${selectedIndex.value * (100 / props.data.opt.length)}% - 0.5rem)`;
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
    <div class="mini-wrap">
      <div class="runner" :style="{ width: `calc(100% / ${props.data.opt.length})`, marginLeft: runnerLeft }"></div>
      <div class="item" :class="{ active: props.modelValue === value.worth }" :style="{ width: `calc(100% / ${props.data.opt.length})` }" v-for="value in props.data.opt" :key="value.worth" @click="selectOption(value.worth)">
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
  .title,
  .desc {
    font-weight: 500;
  }
  .mini-wrap {
    width: 100%;
    margin-top: 0.5rem;
    padding: 1rem 0.5rem;
    border-radius: 2rem;
    position: relative;
    .runner {
      width: 50%;
      height: calc(100% - 0.5rem);
      border-radius: 2rem;
      position: absolute;
      top: 0.25rem;
      bottom: 0.25rem;
      left: 0.25rem;
      background: var(--ex-background);
      z-index: 1;
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
