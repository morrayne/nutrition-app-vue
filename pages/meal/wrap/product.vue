<script setup lang="ts">
import { X } from "@lucide/vue";

import type { tProductSaved } from "../../../appSettings/export/types/food";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  construct: tProductSaved;
  active?: boolean;
}>();
const emits = defineEmits<{
  (e: "delete", value: number): void;
  (e: "main", value: tProductSaved): void;
}>();

const macros = [
  { title: "shortCalories", data: "calories", color: "var(--pu)" },
  { title: "shortProteins", data: "proteins", color: "var(--pi)" },
  { title: "shortFats", data: "fats", color: "var(--ye)" },
  { title: "shortCarbs", data: "carbs", color: "var(--gr)" },
];
</script>

<template>
  <div class="product-wrap bounce w-100 flex-c gap-50 main" @click="emits('main', props.construct)" :class="props.active ? 'active' : ''">
    <div class="w-100 top">
      <p class="text-l">{{ props.construct.name }}</p>
      <div class="main controls" @click.stop>
        <button style="scale: 0.9" @click="emits('delete', props.construct.id!)">
          <X color="var(--sub-color)" />
        </button>
      </div>
    </div>
    <div class="gap-50 bot">
      <div class="gap-50 ali-c" v-for="(item, index) in macros" :key="item.data">
        <div class="dot" v-if="index !== 0"></div>
        <p class="text-s">{{ props.construct[item.data as keyof tProductSaved] + " " + t(item.title) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.active {
  border: solid 1px var(--gr);
}
.product-wrap {
  padding: 0.75rem 1rem;
  .top {
    p {
      max-width: 90%;
      display: inline;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .controls {
      width: fit-content;
      padding: 0.125rem;
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      opacity: 0;
    }
  }
  .bot {
    p {
      color: var(--ex-color);
    }
    .dot {
      width: 0.25rem;
      height: 0.25rem;
      border-radius: 50%;
      background: var(--ex-color);
    }
  }
}
.product-wrap:hover {
  .top .controls {
    opacity: 1;
  }
}
</style>
