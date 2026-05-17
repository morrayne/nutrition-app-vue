<script setup lang="ts">
import type { tSelect } from "../../appSettings/export/types/form";
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
  <div class="flex-c gap-50 w-100">
    <p class="text-l" v-if="props.construct.title">{{ t(props.construct.title) }}</p>
    <div class="flex-c main">
      <div class="row w-100 ali-c jus-sb" v-for="item in construct.data.opt" @click="emits('update:modelValue', item.worth)">
        <p class="text-m">{{ t(item.title) }}</p>
        <Check color="var(--focus)" :opacity="props.modelValue === item.worth ? '1' : '0'"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
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
