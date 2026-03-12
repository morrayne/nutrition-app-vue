<script setup lang="ts">
// IMPORT
// vue
import { ref } from "vue";
import arrow from "../../../public/svg/arrow.vue";

// CONTENT
// type
export interface select_type {
  text: string;
  value: string | number;
}
// prop
const props = defineProps<{
  options: select_type[];
}>();
// emit
const emit = defineEmits<{
  (e: "select", value: string | number): void;
}>();
// var
const selected_value = ref(props.options[0]!.value);
// onclick function
const handleSelect = (value: string | number) => {
  selected_value.value = value;
  emit("select", value);
};
// style of first and last option
const getItemClass = (option: select_type, index: number) => {
  return {active: selected_value.value === option.value, last: index === props.options.length - 1};
};
</script>

<template>
  <div class="ui_select">
    <div v-for="(option, index) in options" :key="option.value" class="item" :class="getItemClass(option, index)" @click="handleSelect(option.value)">
      <div class="cont">
        <p class="text" :style="{'--data-text': `var(--${option.text})`}"></p>
        <div class="svg-holder">
          <arrow :color="'var(--text-b)'" :rotate="180" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ui_select {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;border-radius: 1.5rem;
  border: 1px solid var(--liquid-glass-border);
  backdrop-filter: blur(4px);
  box-shadow: var(--box-shadow);
  overflow: hidden;

  .item {
    flex: 1;
    background: var(--back-b);
    padding: 0 1.5rem;
    cursor: pointer;

    .cont {
      display: flex;
      align-items: center;
      padding: 0.75rem 0;
      justify-content: space-between;
      border-bottom: solid 1px var(--liquid-glass-border);

      .text {
        font-size: var(--mm);
        color: var(--text-b);
      
        &::after {
          content: var(--data-text);
        }
      }

      .svg-holder {
        height: 1rem;
        scale: 2;
      }
    }

    &.last .cont {
      border-bottom: none;
    }
  }

  .item:hover {
    background: var(--back-c);
  }
}
</style>
