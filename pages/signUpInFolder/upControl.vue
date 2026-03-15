<script setup lang="ts">
// IMPORT
// ui
import glass from "@/common/ui/glass.vue";
import arrow from "@/common/svg/arrow.vue";
import account from "@/common/svg/account.vue";
// router
import router from "../../appSettings/router";

// CONTENT
// props 
const props = defineProps<{
  modelValue: {
    current: number
    max: number
  },
  toShow: {
    component: any,
    back: boolean,
    next: boolean,
    signup: boolean
  }
}>()
// emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: { current: number; max: number }): void 
  (e: 'back'): void
  (e: 'next'): void
  (e: 'signup'): void 
}>()
// previous slide
const goBack = () => {
  if (props.modelValue.current > 0) {
    emit('update:modelValue', { ...props.modelValue, current: props.modelValue.current - 1 });
    emit('back');
  }
}
// next slide
const goNext = () => {
  if (props.modelValue.current < props.modelValue.max) {
    emit('update:modelValue', { ...props.modelValue, current: props.modelValue.current + 1 });
    emit('next');
  }
}
const goSignup = () => {
  emit('signup');
}
// vars
const back = {
  type: "svg" as const,
  svg: arrow,
}
const cont = {
  type: "text" as const,
  title: "continue",
}
const signup = {
  type: "text" as const,
  title: "signup",
}
const more = {
  type: "svg" as const,
  svg: account,
}
</script>

<template>
  <div class="up-control">
    <div class="round" @click="goBack" :class="`${props.toShow.back ? 'show' : 'hidden'}`">
      <glass v-bind="back" />
    </div>
    <div class="wider" @click="goNext" :class="`${props.toShow.next ? 'show' : 'hidden'}`" v-if="!props.toShow.signup">
      <glass v-bind="cont" />
    </div>
    <div class="wider" @click="goSignup" :class="`${props.toShow.signup ? 'show' : 'hidden'}`" v-else>
      <glass v-bind="signup" />
    </div>
    <div class="round" @click="router.push('/signin')">
      <glass v-bind="more" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.up-control {
  width: calc(100% - calc(2.5 * var(--mm)));
  height: 3rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: absolute;
  bottom: calc(1.25 * var(--mm));
  left: calc(1.25 * var(--mm));
  z-index: 3;

  .wider, .round {
    height: 100%;
    position: relative;
    cursor: pointer;
  }

  .wider {
    flex: 1;
  }

  .wider::after {
    color: var(--sign-text);
  }

  .round {
    aspect-ratio: 1 / 1;
  }

  .show {
    top: 0;
    opacity: 1;
  }

  .hidden {
    top: 4rem;
    opacity: 0;
    pointer-events: none;
  }
}
</style>
