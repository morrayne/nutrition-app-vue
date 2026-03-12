<script setup lang="ts">
// IMPORT
// vue
import { ref, watch } from "vue";

// CONTENT
// vars
const message = ref("");
const messageQueue = ref<string[]>([]);
const isActive = ref(false);
// props
const props = defineProps<{
  text?: string;
}>();
// error que
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
// watch
watch(() => props.text, (newText) => {
  if (newText) {
    messageQueue.value.push(newText);
    if (!isActive.value) {
      showNextMessage();
    }
  }
});
</script>

<template>
  <div class="dinamic-island">
    <div :class="message ? 'popup' : 'camera'" :style="{ '--text-item': `var(--${message})` }"></div>
  </div>
</template>

<style scoped lang="scss">
.dinamic-island {
  width: 100%;
  border-radius: 2.875rem 2.875rem 0 0;
  display: flex;
  justify-content: center;
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0.5rem;

  .camera, .popup {
    transition: all 0.2s;
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
    border-radius: 2.5rem;
    padding: 1rem;
    background: var(--accent);
    color: var(--back-a);
    font-size: calc(var(--mm) * 0.8);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
    top: 0.5rem;
  }

  .popup::after {
    content: var(--text-item);
  }
}
</style>
