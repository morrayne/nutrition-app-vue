<script setup lang="ts">
import { ref } from "vue";
import localText from "../ui/localText.vue";
import selectArrow from "@/svg/selectArrow.vue";

export interface tColSelectOpt {
  title: string;
  toEmit: string | number;
}
export interface tColSelect {
  title?: string;
  data: {
    type: "string" | "number";
    start: number;
    options: tColSelectOpt[];
  };
}

const props = defineProps<tColSelect>();
const emits = defineEmits<{(e: 'update:modelValue', value: string | number): void}>();
const activeValue = ref<string | number>(props.data.options[props.data.start]!.toEmit);

const handleClick = (data: tColSelectOpt) => {
  activeValue.value = data.toEmit;
  emits('update:modelValue', data.toEmit);
};
</script>

<template>
  <div class="col-select">
    <localText class="col-select-title" v-if="props.title" :text="props.title" />
    <div class="col-select-opt">
      <div class="opt-holder">
        <div class="opt" v-for="option in props.data.options" :key="option.toEmit" @click="handleClick(option)">
          <localText :text="option.title" />
          <div class="svg-holder"><selectArrow :color="option.toEmit !== activeValue ? 'var(--ex-background)' : 'var(--sub-color)'" :rotate="0" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.col-select {
  flex-direction: column;
  gap: calc(0.75 * var(--newrem));

  .col-select-title {
    font-size: var(--size-l);
    font-weight: 500;
  }

  .col-select-opt {
    border-radius: calc(1.5 * var(--newrem));
    background: var(--sub-background);
    border: solid 1px var(--ex-background);
    box-shadow: var(--box-shadow);

    .opt-holder {
      width: 100%;
      padding: calc(0.5 * var(--newrem)) calc(1.25 * var(--newrem));
      flex-direction: column;

      .opt {
        padding: calc(0.5 * var(--newrem)) 0;
        border-bottom: solid 1px var(--ex-background);
        color: var(--ex-color);
        cursor: pointer;
      }

      .opt:last-child {
        border-bottom: none;
      }

      .svg-holder {
        width: 1.5rem;
        margin-left: auto;
      }
    }
  }
}
</style>
