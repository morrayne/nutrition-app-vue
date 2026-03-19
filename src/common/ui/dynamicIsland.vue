<script setup lang="ts">
// IMPORT
// vue
import { ref, watch, computed } from "vue";

// CONTENT
// vars
const message = ref("");
const messageQueue = ref<string[]>([]);
const isActive = ref(false);

// props
const props = defineProps<{
  text?: string[];
}>();

// Преобразуем массив в строку: числа оставляем, CSS переменные заменяем значениями
const displayText = computed(() => {
  if (!props.text || props.text.length === 0) return '';
  
  return props.text.map(item => {
    if (!isNaN(Number(item)) && item.trim() !== '') {
      return item; 
    } else {
      const cssVarName = item.startsWith('--') ? item : `--${item}`;
      let cssVar = getComputedStyle(document.documentElement).getPropertyValue(cssVarName).trim();
      cssVar = cssVar.replace(/["']/g, '');
      return cssVar || item;
    }
  }).join(' ');
});

watch(() => props.text, (newVal) => {
  if (newVal && newVal.length > 0) {
    messageQueue.value = [...newVal];
    if (!isActive.value) {
      showNextMessage();
    }
  } else {
    messageQueue.value = [];
    isActive.value = false;
    message.value = "";
  }
}, { deep: true, immediate: true });

// error queue
const showNextMessage = () => {
  if (messageQueue.value.length === 0) {
    isActive.value = false;
    message.value = "";
    return;
  }
  isActive.value = true;
  message.value = messageQueue.value.shift()!;
  setTimeout(() => {
    showNextMessage();
  }, 3000);
};
</script>

<template>
  <div class="dinamic-island">
    <div class="wrap">
      <div :class="displayText ? 'popup' : 'camera'">
        <p v-if="displayText" :style="{ '--item-text': `'${displayText}'` }"></p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dinamic-island {
  width: 100%;
  height: 2.5rem;
  border-radius: 2.875rem 2.875rem 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 3;
  top: 0;
  left: 0;

  .wrap {
    width: calc(100%);
    display: flex;
    justify-content: center;

    .camera, .popup {
      transition: all 0.2s;

      p {
        color: #fff;
      }

      p::after {
        content: var(--item-text);
      }
    }

    .camera {
      width: 7.5rem;
      height: 1.5rem;
      border-radius: 2rem;
      background: #000;
      position: relative;
      top: 0;
    }

    .popup {
      width: calc(100% - 2rem);
      padding: 1rem;
      border-radius: 1.5rem;
      background: #000;
      box-shadow: var(--box-shadow);
      backdrop-filter: blur(6px);
      color: var(--back-a);
      font-size: calc(var(--mm) * 0.8);
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      position: relative;
      top: var(--mm);
    }
  }
}
</style>
