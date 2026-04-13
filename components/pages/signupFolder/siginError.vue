<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import localText from "../../ui/localText.vue";

const props = defineProps<{ error: boolean }>();
const showError = ref(false);
let timer: any = null;

watch(() => props.error, (newError) => {
  if (newError) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      showError.value = true;
      timer = null;
    }, 10);
  } else {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    showError.value = false;
  }
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <TransitionGroup name="error" tag="div" class="errors-container">
    <div v-if="showError" key="signin-error" class="error-manager">
      <localText text="sign-up-failed" style="color: white" />
      <div class="desc">
        <localText text="please-check-form" size="s" style="color: white" />
      </div>
    </div>
  </TransitionGroup>
</template>

<style scoped lang="scss">
.errors-container {
  position: absolute;
  width: calc(100% - 2.5rem);
  justify-content: center;
  top: 0.75rem;
  left: 1.25rem;
}
.error-manager {
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 4.25rem;
  flex-direction: column;
  background: #000;
  padding: calc(0.75 * var(--newrem)) calc(1.25 * var(--newrem));
  border-radius: calc(2.5 * var(--newrem));
  overflow: hidden;
  .desc {
    gap: calc(0.65 * var(--size-s));
    opacity: 1;
  }
}
.error-enter-from {
  width: 6rem;
  max-width: 6rem;
  height: 1.5rem;
  max-height: 1.5rem;
  .desc {
    opacity: 0;
  }
}
.error-leave-to {
  width: 6rem;
  max-width: 6rem;
  height: 1.5rem;
  max-height: 1.5rem;
  .desc {
    opacity: 0;
  }
}
</style>
