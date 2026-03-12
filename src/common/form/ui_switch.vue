<script setup lang="ts">
// IMPORT
// vue
import { ref } from "vue";

// CONTENT
// type
export interface switch_type {
  text: string;
  option1: string;
  option2: string;
}
// prop
const props = defineProps<switch_type>();
// emit
const emit = defineEmits<{
  (e: "switch", value: string): void;
}>();
// var
const selected_value = ref(props.option1);
// onclick function
const handle_switch = () => {
  if (selected_value.value === props.option1) {
    selected_value.value = props.option2;
  } else {
    selected_value.value = props.option1;
  }
  emit("switch", selected_value.value);
};
</script>

<template>
  <div class="switcher">
    <p class="text" :style="{'--data-text': `var(--${props.text})`}"></p>
    <div class="switch" :class="{ active: selected_value === props.option2 }" @click="handle_switch">
      <div class="gap"></div>
      <div class="runner" :style="{background: selected_value === props.option2 ? 'var(--back-a)' : 'var(--back-d)' }"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.switcher {
  margin-top: 0.5rem;
  height: 3rem;
  padding: 0 1.5rem;
  border-radius: 1.5rem;
  background: var(--back-b);
  border: 1px solid var(--liquid-glass-border);
  box-shadow: var(--box-shadow);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .text {
      font-size: var(--mm);
      color: var(--text-b);
    
    &::after {
      content: var(--data-text);
    }
  }

  .switch {
    width: 2.75rem;
    height: 1.25rem;
    border-radius: 2rem;
    padding: 0.25rem;
    background: var(--back-c);
    transition: 0.1s;
    cursor: pointer;
    display: flex;

    .gap {
      transition: 0.1s;
    }

    .runner {
      width: 1.5rem;
      border-radius: 1rem;
      height: 100%;
      background: var(--back-d);
    }
  }

  .active {
    background: var(--accent);

    .gap {
      flex: 1;
    }
  }
}
</style>
