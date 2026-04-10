<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from "vue";
import localText from "../../ui/localText.vue";

export interface err {
  interaction: "err" | "err-fix" | "nothing";
  page: number;
  field: string;
  text: string[];
  errValue: string | number;
}

const props = defineProps<{ error?: err }>();
const errLog = ref<err[]>([]);

const timers = ref(new Map());

const hasActiveErrors = computed(() => {
  return errLog.value.some(err => err.interaction === 'err');
});

const everyThingEmpty = computed(() => {
  return errLog.value.every(err => (err.errValue === '' && err.interaction === 'err'));
});

// Отфильтрованные видимые ошибки для анимации
const visibleErrors = computed(() => {
  return errLog.value.filter(err => 
    hasActiveErrors.value && 
    !everyThingEmpty.value && 
    err.interaction === 'err'
  );
});

watch(() => props.error, (newError) => {
  if (!newError) return;
  const field = newError.field;
  const isFixed = newError.errValue === '' || newError.interaction !== 'err';
  
  if (isFixed) {
    if (timers.value.has(field)) {
      clearTimeout(timers.value.get(field)!);
      timers.value.delete(field);
    }
    const existingIndex = errLog.value.findIndex(e => e.field === field);
    if (existingIndex !== -1) {
      if (newError.interaction === 'err-fix') errLog.value[existingIndex] = newError;
      else errLog.value.splice(existingIndex, 1);
    }
    return;
  }
  
  if (timers.value.has(field)) clearTimeout(timers.value.get(field)!);
  timers.value.set(field, setTimeout(() => {
    const existingIndex = errLog.value.findIndex(e => e.field === field);
    if (existingIndex !== -1) errLog.value[existingIndex] = newError;
    else errLog.value.push(newError);
    timers.value.delete(field);
  }, 1000));
  
}, { deep: true });

onUnmounted(() => {
  timers.value.forEach(timer => clearTimeout(timer));
  timers.value.clear();
});
</script>

<template>
  <TransitionGroup name="error" tag="div" class="errors-container">
    <div v-for="singleError in visibleErrors" :key="singleError.field" class="error-manager">
      <localText :text="singleError.field" style="color: white" />
      <div class="desc">
        <localText v-for="value in singleError.text" :text="value" size="s" style="color: white" />
        <p class="err-value"> {{ singleError.errValue }} </p>
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
  max-height: 4.25rem;
  max-height: 4.25rem;
  flex-direction: column;
  background: #000;
  padding: calc(0.75 * var(--newrem)) calc(1.25 * var(--newrem));
  border-radius: calc(2.5 * var(--newrem));
  overflow: hidden;
  z-index: 3;

  .desc {
    gap: calc(0.65 * var(--size-s));
    opacity: 1;
  }

  .err-value {
    font-size: var(--size-s);
    color: white;
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
