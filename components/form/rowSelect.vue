<script setup lang="ts">
import { ref } from "vue";
import localText from "../ui/localText.vue";

export interface tRowSelectOpt {
  title: string;
  toEmit: string | number;
}
export interface tRowSelect {
  title?: string;
  desc?: string;
  data: {
    type: "string" | "number";
    start: number;
    options: tRowSelectOpt[];
  };
}

const props = defineProps<tRowSelect>();
const emit = defineEmits<{(e: 'update:modelValue', value: string | number): void}>();
const activeValue = ref<string | number>(props.data.options[props.data.start]!.toEmit);

const handleClick = (data: tRowSelectOpt) => {
  activeValue.value = data.toEmit;
  emit('update:modelValue', data.toEmit);
};
</script>

<template>
  <div class="row-select">
    <localText class="row-select-title" v-if="props.title" :text="props.title" />
    <div class="row-select-opt">
      <div v-for="option in props.data.options" :class="option.toEmit === activeValue ? 'active opt' : 'opt'" :style="{width: `${100 / props.data.options.length}%`}" @click="handleClick(option)">
        <localText :text="option.title" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.row-select {
  flex-direction: column;
  gap: 0.5rem;

  .row-select-title {
    font-size: var(--size-l);
    font-weight: 500;
  }

  .row-select-opt {
    gap: 0.25rem;
    border-radius: calc(1.5 * var(--newrem));
    padding: calc(0.375 * var(--newrem));
    background: var(--sub-background);
    border: solid 1px var(--ex-background);
    box-shadow: var(--box-shadow);

    .opt {
      padding: calc(0.375 * var(--newrem));
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }

    .active {
      background: var(--ex-background);
      border-radius: calc(1.5 * var(--newrem));
    }
  }
}
</style>
