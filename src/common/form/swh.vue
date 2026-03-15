<script setup lang="ts">
// IMPORT
import { ref, watch, computed } from "vue";

export interface tSwh {
  title: string;
  data: {
    type: "text" | "number";
    start: "on" | "off";
    on: string | number;
    off: string | number;
  }
}

// CONTENT
// props
const props = defineProps<tSwh>()
// emit
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

// Инициализируем selectedValue на основе start
const selectedValue = ref(props.data.start === 'on' ? props.data.on : props.data.off)

// Следим за изменениями и эмитим
watch(selectedValue, (newVal) => {
  emit('update:modelValue', newVal)
  emit('change', newVal)
})

// Переключение между on и off
const handleSwitch = () => {
  selectedValue.value = selectedValue.value === props.data.on ? props.data.off : props.data.on
}

// Вычисляем активное состояние (on = активно, off = не активно)
const isActive = computed(() => selectedValue.value === props.data.on)
</script>

<template>
  <div class="swh">
    <p class="title" :style="{ '--item-text': `var(--${props.title})` }"></p>
    <div class="switch" :class="{ active: isActive }" @click="handleSwitch">
      <div class="gap"></div>
      <div class="runner" :style="{ background: isActive ? 'var(--light)' : 'var(--html-background)' }"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.swh {
  width: 100%;
  padding: calc(0.75 * var(--mm)) calc(1.5 * var(--mm));
  font-size: var(--mm);
  display: flex;
  justify-content: space-between;
  border-radius: 2rem;
  border: solid 1px var(--sign-border);
  box-shadow: var(--box-shadow);
  backdrop-filter: blur(6px);

  .title {
    width: fit-content;
  }

  .title::after {
    content: var(--item-text);
  }

  .switch {
    width: 2.75rem;
    height: 1.25rem;
    border-radius: 2rem;
    padding: 0.25rem;
    background: var(--sign-border);
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
    }
  }

  .active {
    background: var(--swh-background);

    .gap {
      flex: 1;
    }
  }
}
</style>

