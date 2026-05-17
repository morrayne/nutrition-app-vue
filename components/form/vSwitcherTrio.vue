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
  if (data === props.construct.data.opt[1]!.worth) runnerStyle.value.left = "calc(33.3% + 0.125rem)";
  if (data === props.construct.data.opt[2]!.worth) runnerStyle.value.left = "calc(66.6%)";
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
  <div class="flex-c gap-50 w-100">
    <p class="text-l" v-if="props.construct.title">{{ t(props.construct.title) }}</p>
    <div class="pos-r main">
      <div class="pos-a runner" :style="runnerStyle"></div>
      <p class="w-100 h-100 jus-c pos-r text-m" v-for="item in construct.data.opt" @click="handleClick(item.worth)">{{ t(item.title) }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  padding: 0.5rem 0.75rem;
  .runner {
    width: calc(33.3% - 0.25rem);
    height: calc(100% - 0.5rem);
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
