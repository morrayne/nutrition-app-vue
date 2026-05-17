<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const navigation = ["history", "intake", "products", "meals", "suggestions"];

const props = defineProps<{
  modelValue: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<template>
  <div class="a left-0 w-100 pos-a jus-c">
    <div class="w-100 max-w-1440 b">
      <div class="w-fit over-x c">
        <div class="meal w-100 g-05 main">
          <p v-for="item in navigation" class="text-m meal-item" :class="props.modelValue === item ? 'active' : ''" @click="emits('update:modelValue', item)">{{ t(item) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.a {
  padding: 0 1rem;
  bottom: 6.5rem;
  z-index: 3;
  .c {
    max-width: 100%;
    .meal {
      width: fit-content;
      border-radius: 3rem;
      padding: 0.25rem;
      .meal-item {
        padding: 0.25rem 1rem;
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

@media (max-width: 1280px) {
  .a {
    bottom: 6rem;
  }
}
@media (max-width: 640px) {
  .a {
    bottom: 5.25rem;
  }
}
</style>
