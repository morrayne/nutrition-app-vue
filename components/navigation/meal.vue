<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  modelValue: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

// const navigation = ["deepAnalisys", "history", "intake", "products", "meals", "suggestions"];
const navigation = ["history", "intake", "products", "meals", "suggestions"];
</script>

<template>
  <div class="meal-wrap w-100 pos-a j-c">
    <div class="s">
      <div class="meal w-100 g-05 def-wrap">
        <p v-for="item in navigation" class="fs-s fw-6 meal-item" :class="props.modelValue === item ? 'active' : ''" @click="emits('update:modelValue', item)">{{ t(item) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.meal-wrap {
  bottom: 6rem;
  left: 0;
  z-index: 3;
  .s {
    max-width: 1080px;
    width: calc(100% - 2rem);
    .meal {
      justify-content: center;
      backdrop-filter: blur(0.5rem);
      border-radius: 3rem;
      padding: 0.125rem;
      overflow-x: auto;
      .meal-item {
        padding: 0.25rem 0.75rem;
        border-radius: 3rem;
        cursor: pointer;
      }
      .active {
        background: var(--ex-background);
      }
    }
    .meal::-webkit-scrollbar {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .meal-wrap {
    bottom: 5rem;
    .meal {
      justify-content: unset !important;
    }
  }
}
</style>
