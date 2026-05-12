<script setup lang="ts">
import { ref, watch } from "vue";
import type { tSelect } from "../../appSettings/export/types/form";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  construct: tSelect;
  modelValue?: string | number;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();

const runnerStyle = ref({
  scale: 1,
  left: "0.25rem",
});

const handleClick = (data: string | number) => {
  emits("update:modelValue", data);
  if (data === props.construct.data.opt[0]!.worth) runnerStyle.value.left = "0.25rem";
  else runnerStyle.value.left = "calc(50% + 0.125rem)";
  runnerStyle.value.scale = 1.1;
  setTimeout(() => {
    runnerStyle.value.scale = 1;
  }, 150);
};

watch(() => props.modelValue, (newVal) => {
  if (newVal) handleClick(newVal);
}, { deep: true, immediate: true });
</script>

<template> 
  <div class="flex-c g-05 w-100">
    <p class="fs-l" v-if="props.construct.title">{{ t(props.construct.title) }}</p>
    <div class="pos-r def-wrap">
      <div class="runner" :style="runnerStyle"></div>
      <p class="w-100 h-100 j-c pos-r" v-for="item in construct.data.opt" @click="handleClick(item.worth)">{{ t(item.title) }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.def-wrap {
  padding: 0.5rem 0.75rem;
  .runner {
    width: calc(50% - 0.375rem);
    height: calc(100% - 0.5rem);
    position: absolute;
    background: var(--ex-background);
    border-radius: 1rem;
    top: 0.25rem;
    pointer-events: none;
  }
  p {
    padding: 0.5rem 0.75rem;
    cursor: pointer;
  }
}
</style>
