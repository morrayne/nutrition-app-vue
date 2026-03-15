<script setup lang="ts">
// IMPORT
// vue
import { ref, watch, computed } from "vue";

// CONTENT
// type
export interface tSelOpt {
  title: string;
  toEmit: string | number;
}
export interface tSel {
  title: string;
  data: {
    type: "text" | "number";
    start: number;
    options: tSelOpt[];
  };
}
// props
const props = defineProps<tSel>();
// emits
const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "select", value: string | number): void;
}>();
// vars
const selectedValue = ref<string | number>(
  props.data.options[props.data.start]?.toEmit ??
    props.data.options[0]?.toEmit ??
    "",
);
const selectedIndex = computed(() =>
  props.data.options.findIndex((opt) => opt.toEmit === selectedValue.value),
);
// watch
watch(selectedValue, (newVal) => {
  if (newVal !== undefined && newVal !== null) {
    emit("update:modelValue", newVal as string | number);
    emit("select", newVal as string | number);
  }
});
//
const handleSelect = (value: string | number) => {
  selectedValue.value = value;
};
//
const getItemClass = (option: tSelOpt, index: number) => {
  return {
    active: selectedValue.value === option.toEmit,
    first: index === 0,
    last: index === props.data.options.length - 1,
    act: index < selectedIndex.value,
  };
};
</script>

<!-- prettier-ignore -->
<template>
  <div class="s">
    <p class="title" :style="{ '--item-text': `var(--${props.title})` }"></p>
    <div class="sel">
      <div class="options">
        <div class="item" :class="getItemClass(option, index)" v-for="(option, index) in data.options" :key="option.toEmit" @click="handleSelect(option.toEmit)">
          <div class="cont">
            <p class="text" :style="{ '--data-text': `var(--${option.title})` }"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.s {
  display: flex;
  flex-direction: column;
  gap: calc(var(--mm) * 0.5);

  .title {
    font-size: var(--mm);
    padding: 0 calc(1.5 * var(--mm));
  }

  .title::after {
    content: var(--item-text);
  }

  .sel {
    display: flex;
    flex-direction: column;
    border-radius: calc(var(--mm) * 1.5);
    border: 1px solid var(--sign-border);
    box-shadow: var(--box-shadow);
    backdrop-filter: blur(6px);
    overflow: hidden;

    .item {
      flex: 1;
      padding: 0 calc(var(--mm) * 1.5);
      cursor: pointer;

      .cont {
        display: flex;
        align-items: center;
        padding: calc(var(--mm) * 0.75) 0;
        justify-content: space-between;
        border-bottom: solid 1px var(--sign-border);

        .text {
          font-size: var(--mm);
        }

        .text::after {
          content: var(--data-text);
        }
      }

      &.last .cont {
        border-bottom: none;
      }
    }

    .active {
      background: var(--active-background);
    }
  }
}
</style>
