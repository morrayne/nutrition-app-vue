<script setup lang="ts">
import glass from "../wraps/glass.vue";

const props = defineProps<{
  modelValue: number;
  current: number;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const data = [
  { title: "intake" },
  { title: "single" },
  { title: "groups" },
  { title: "create" },
];
</script>

<template>
  <div class="under-navigation-wrap">
    <div class="under-navigation">
      <glass />
      <div class="runner"></div>
      <div class="item" v-for="value in data">
        <p> {{ value.title }} </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.under-navigation-wrap {
  width: 100%;
  justify-content: center;
  position: absolute;
  top: 6.5rem;
  left: 0;
  z-index: 3;
  .under-navigation {
    width: fit-content;
    padding: 0.25rem 1rem;
    position: relative;
  }
}
</style>
