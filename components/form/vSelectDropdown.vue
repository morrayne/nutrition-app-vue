<script setup lang="ts">
import { ref } from "vue";

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

const isOpen = ref<boolean>(false);
</script>

<template>
  <div class="flex-c g-05 w-100">
    <div class="pos-r a-c j-b def-wrap">
      <p class="p-2" v-if="props.construct.title">{{ t(props.construct.title) }}</p>
      <div class="h-100 right">123</div>
      <!-- <div class="h-100 pos-r flex-c drop-close" @click="isOpen = true">
        <p class="w-100 h-100 def-wrap item">{{ props.modelValue }}</p>
      </div>
      <div class="h-100 pos-r flex-c drop-open">
        <p class="w-100 h-100 pos-a item" v-for="(item, index) in construct.data.opt" :style="{ top: `calc(2.5rem * ${index})` }">{{ item.title }}</p>
      </div> -->
      <!-- <div class="row w-100 a-c j-b" v-for="item in construct.data.opt" @click="emits('update:modelValue', item.worth)">
        <p class="">{{ item.title }}</p>
        <Check color="var(--focus)" :opacity="props.modelValue === item.worth ? '1' : '0'" />
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.def-wrap {
//   padding: 0.5rem 0.5rem 0.5rem 1.5rem;
  .right {

  }
  .drop-close {
    .item {
      padding: 0.5rem 1rem;
      border-radius: 0.75rem;
    }
  }
  .drop-open {
    width: 6rem;
    padding: 0.5rem 1rem;
    .item {
      left: 0;
    }
  }
}
</style>
