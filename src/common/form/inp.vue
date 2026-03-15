<script setup lang="ts">
// IMPORT
import { ref, watch, computed } from "vue";

export interface tInp {
  title: string;
  data: {
    type: "text" | "number";
    start: string | number | null;
    placeholder?: string;
  }
  width: {
    left: number;
    right: number;
  }
}

// CONTENT
// props
const props = defineProps<tInp & { modelValue?: string | number }>()

// emit
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'input', value: string | number): void
  (e: 'change', value: string | number): void
}>()

// Инициализируем inputValue на основе start или modelValue
const inputValue = ref(props.modelValue ?? props.data.start)

// Следим за изменениями из родителя (v-model)
watch(() => props.modelValue, (newVal) => {
  if (newVal) inputValue.value = newVal
})

// Следим за локальными изменениями и эмитим
watch(inputValue, (newVal) => {
  if (newVal) {
    emit('update:modelValue', newVal)
    emit('input', newVal)
    emit('change', newVal)
  }
})

// Обработчик ввода
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = props.data.type === 'number' ? Number(target.value) : target.value;
  inputValue.value = value;
}

const leftStyle = computed(() => ({
  title: `var(--${props.title})`,
  width: `${props.width.left}%`,
}))
const rightStyle = computed(() => ({
  width: `${props.width.right}%`
}))
</script>

<template>
  <div class="inp">
    <p class="title" :style="{ '--item-text': leftStyle.title, width: leftStyle.width }"></p>
    <div class="input-wrapper" :style="{width: rightStyle.width}">
      <input class="input-field" :type="data.type" :placeholder="props.data.placeholder || '...'" :value="inputValue" @input="handleInput"  />
    </div>
  </div>
</template>

<style scoped lang="scss">
.inp {
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
    font-size: var(--mm);
    color: var(--html-color);  
  }

  .title::after {
    content: var(--item-text);
  }

  .input-wrapper {
    overflow: hidden;

    input {
      width: 100%;
      border: none;
      outline: none;
      background: none;
      font-size: var(--mm);
    }
  }
}
</style>
