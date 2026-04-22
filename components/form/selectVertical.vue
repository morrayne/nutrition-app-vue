<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { Check } from '@lucide/vue';

import type { tSelect } from "../../appSettings/types";

const props = defineProps<tSelect & { modelValue?: string | number }>();
const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const selectOption = (worth: string | number) => {
  emits('update:modelValue', worth);
};
</script>

<template>
  <div class="select-horizontal">
    <p class="title" v-if="props.title" :style="{fontSize: `var(--size-${props.st?.fontSize === 'm' ? 'l' : 'm'})`}">{{ t(props.title) }}</p>
    <p class="desc" v-if="props.desc" :style="{fontSize: `var(--size-${props.st?.fontSize === 'm' ? 's' : 'xs'})`}">{{ t(props.desc) }}</p>
    <div class="mini-wrap">
      <div class="row" v-for="value in props.data.opt" :key="value.worth"@click="selectOption(value.worth)">
        <div class="item">
          <p :style="{fontSize: `var(--size-${props.st?.fontSize || 'm'})`}"> {{ t(value.title) }} </p>
          <div class="svg-holder" :style="{opacity: modelValue === value.worth ? '1' : '0' }">
            <Check color="var(--focus)" :rotate="0" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.select-horizontal {
  width: 100%;
  flex-direction: column;
  .title, .desc {
    font-weight: 500;
  }
  .mini-wrap {
    width: 100%;
    flex-direction: column;
    margin-top: 0.5rem;
    padding: 1rem 0;
    border-radius: 2rem;
    .row {
      width: 100%;
      padding: 0 2rem;
      .item {
        width: 100%;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: solid 1px var(--ex-background);
        justify-content: space-between;
        cursor: pointer;
        .svg-holder {
          height: calc(1.25 * var(--size-m));
          aspect-ratio: 1 / 1;
        }
      }
    }
    .row:last-child .item {
      border-bottom: none;
    }
  }
}
</style>
