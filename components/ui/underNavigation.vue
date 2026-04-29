<script setup lang="ts">
import { ref, watch } from "vue";

import glass from "../wraps/glass.vue";
import { subNavigationArray } from "../../appSettings/defaultExport";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  modelValue: number;
  current: number;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

watch(() => props.modelValue, (newVal) => {
  active.value = newVal;
  scale.value = 1.2;
  setTimeout(() => {
    scale.value = 1;
  }, 100);
});

const active = ref<number>(0);
const scale = ref<number>(1);

const handleClick = (data: number) => {
  if (data !== active.value) {
    active.value = data;
    emits("update:modelValue", data); 
  }
}
</script>
 
<template>
  <div class="under-navigation-wrap center" v-if="props.current !== -1">
    <div class="under-navigation">
      <glass />
      <div class="runner" :style="{left: `calc(${active} * 6rem + 0.25rem)`, scale: scale}"></div>
      <div class="item prz-2" v-for="(miniArray, index) in subNavigationArray">
        <p v-for="(item, newIndex) in miniArray" :class="newIndex === active ? 'active bounce center' : 'bounce center'" v-if="index === props.current" @click="handleClick(Number(newIndex))"> {{ t(item) }} </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.under-navigation-wrap {
  width: 100%;
  position: absolute;
  top: 7rem;
  left: 0;
  z-index: 3;
  .under-navigation {
    width: fit-content;
    padding: 0.25rem;
    position: relative;
    .runner {
      width: 6rem;
      height: calc(100% - 0.5rem);
      border-radius: 1.5rem;
      background: var(--ex-background-tr);
      backdrop-filter: blur(2px);
      border-radius: 2rem;
      position: absolute;
      top: 0.25rem;
      z-index: 2;
    }
    .item {
      padding: 0.125rem 0;
      p {
        width: 6rem;
        font-size: var(--size-xs);
        cursor: pointer;
      }
      .active {
        color: var(--focus);
      }
    }
  }
}

@media (max-width: 768px) {
  .under-navigation-wrap {
    top: unset;
    bottom: 6.5rem;
    scale: 1.25;
  }
}
</style>
