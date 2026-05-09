<script setup lang="ts">
import type { tSelect } from "../../appSettings/types/form";
import { Check } from "@lucide/vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  construct: tSelect;
  modelValue?: string | number;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
}>();
</script>

<template> 
  <div class="flex-c g-05 w-100">
    <p class="fs-l" v-if="props.construct.title">{{ t(props.construct.title) }}</p>
    <div class="flex-c def-wrap">
      <div class="row w-100 a-c j-b" v-for="item in construct.data.opt" @click="emits('update:modelValue', item.worth)">
        <p>{{ item.title }}</p>
        <Check color="var(--focus)" :opacity="props.modelValue === item.worth ? '1' : '0'"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.def-wrap {
  padding: 0.5rem 1.5rem;
  .row {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--ex-background);
    cursor: pointer;
  }
  .row:last-child {
    border-bottom: none;
  }
}
</style>
