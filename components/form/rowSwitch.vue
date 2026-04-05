<script setup lang="ts">
import { ref, computed, watch } from "vue";
import localText from "../ui/localText.vue";

export interface tRowSwitch {
  title: string;
  data: {
    type: "text" | "number";
    start: "on" | "off";
    on: string | number;
    off: string | number;
  };
}

const props = defineProps<tRowSwitch & { modelValue?: string | number }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const selectedValue = ref(props.modelValue ?? (props.data.start === 'on' ? props.data.on : props.data.off));
const isActive = computed(() => selectedValue.value === props.data.on);

const handleSwitch = () => {
  const newValue = selectedValue.value === props.data.on ? props.data.off : props.data.on;
  selectedValue.value = newValue;
  emit('update:modelValue', newValue);
};

watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined) {
    selectedValue.value = newVal;
  }
});
</script>

<template>
  <div class="row-switch">
    <localText :text="props.title" />
    <div :class="isActive ? 'switch active' : 'switch'" @click="handleSwitch">
      <div class="gap"></div>
      <div class="runner"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.row-switch {
  justify-content: space-between;
  font-size: var(--size-m);
  padding: calc(0.75 * var(--newrem)) calc(1.25 * var(--newrem));
  border: solid 1px var(--ex-background);
  border-radius: calc(1.5 * var(--newrem));
  background: var(--sub-background);
  box-shadow: var(--box-shadow);

  .switch {
    width: 2.75rem;
    border-radius: 1rem;
    padding: 3px;
    background: var(--ex-background);
    cursor: pointer;

    .runner {
      width: 1.5rem;
      background: var(--main-background);
      border-radius: 1rem;
      height: 100%;
    }
  }

  .active.switch {
    background: var(--gr);
  }

  .active .gap {
    flex: 1;
  }
  
}
</style>
