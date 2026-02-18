<script setup lang="ts">
// vue
import { ref, computed, watch } from "vue";
// props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
});
// emits
const emit = defineEmits(["infoInput"]);
// debounce timer
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null);
// emit function
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
  debounceTimer.value = setTimeout(() => {
    const numValue = value === "" ? null : Number(value);
    emit("infoInput", props.field, numValue);
  }, 1000);
};

// Animation states
const empty = [
  { top: "0", rotate: "0", opacity: "1" },
  { top: "-0.5", rotate: "-90", opacity: "0" },
  { top: "0.5", rotate: "-180", opacity: "0" },
];
const invalid = [
  { top: "0.5", rotate: "90", opacity: "0" },
  { top: "0", rotate: "0", opacity: "1" },
  { top: "-0.5", rotate: "-90", opacity: "1" },
];
const valid = [
  { top: "0", rotate: "-180", opacity: "0" },
  { top: "0.5", rotate: "90", opacity: "0" },
  { top: "0", rotate: "0", opacity: "1" },
];

const checker = computed(() => {
  if (props.data.status === 0) return empty;
  if (props.data.status === 1) return invalid;
  return valid;
});
</script>

<template>
  <div class="number-input">
    <div class="holder">
      <p
        :style="{
          top: `${checker[0]?.top}rem`,
          transform: `rotateX(${checker[0]?.rotate}deg)`,
          opacity: checker[0]?.opacity,
        }"
      >
        enter number
      </p>
      <p
        :style="{
          top: `${checker[1]?.top}rem`,
          transform: `rotateX(${checker[1]?.rotate}deg)`,
          opacity: checker[1]?.opacity,
        }"
      >
        invalid input
      </p>
      <p
        :style="{
          top: `${checker[2]?.top}rem`,
          transform: `rotateX(${checker[2]?.rotate}deg)`,
          opacity: checker[2]?.opacity,
        }"
      >
        valid input
      </p>
    </div>
    <input
      type="number"
      :placeholder="data.placeholder"
      @input="onInput"
      step="any"
    />
  </div>
</template>


<style scoped>
.number-input {
  display: flex;
  flex-direction: column;

  .holder {
    height: 1.5rem;
    position: relative;

    p {
      position: absolute;
      transition: all 0.2s ease, opacity 0.1s;
    }
  }
}

.number-input {
  input {
    color: var(--text-b);
    background: var(--back-c);
    padding: 0.5rem 1rem;
    outline: none;
    border: solid 1px var(--back-d);
    border-radius: 0.5rem;
  }
  ::placeholder {
    color: var(--text-c);
  }
}
</style>
