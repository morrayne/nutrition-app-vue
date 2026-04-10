<script setup lang="ts">
import { computed, ref, onMounted } from "vue";

const props = defineProps<{
  text: string;
  size?: string;
  wrap?: boolean;
  weight?: number;
}>();

const lang = ref(document.documentElement.getAttribute('lang') || 'en');
const observer = new MutationObserver(() => {
  lang.value = document.documentElement.getAttribute('lang') || 'en';
});
const displayText = computed(() => {
  const _ = lang.value;
  const cssVarName = `--${props.text}`;
  let value = getComputedStyle(document.documentElement).getPropertyValue(cssVarName).trim();
  if (value) {
    value = value.replace(/^["']|["']$/g, '');
    return value;
  }
  return props.text;
});

onMounted(() => {
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
});
</script>

<template>
  <p class="local-text" :style="{ whiteSpace: props.wrap ? 'normal' : 'nowrap', overflow: props.wrap ? 'unset' : 'hidden', fontSize: `var(--size-${props.size || 'm'})`, fontWeight: props.weight || '300' }">
    {{ displayText }}
  </p>
</template>

<style scoped lang="scss">
.local-text {
  min-height: fit-content;
  font-size: var(--size-m);
  display: block;
  text-align: justify;
  color: inherit;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
