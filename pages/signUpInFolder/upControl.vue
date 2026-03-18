<script setup lang="ts">
// IMPORT
// vue
import { computed } from "vue";
// ui
import glass from "@/common/ui/glass.vue";
import arrow from "@/common/svg/arrow.vue";
import account from "@/common/svg/account.vue";
// router
import router from "../../appSettings/router";
import type { tAuth } from "../../stores/types";
import type { tUpdateViewArray } from "../signUpPage.vue"; 

// CONTENT
// props 
const props = defineProps<{
  toDisplay: {
    back: boolean;
    forward: boolean;
    signup: boolean;
    profile: boolean;
  };
  viewCurrent: number
}>()
// emits
const emits = defineEmits<{
  (e: 'back'): void
  (e: 'next'): void
  (e: 'signup'): void 
  (e: 'updateViewArray', value: tUpdateViewArray): void 
}>()
// vars
const back = {
  type: "svg" as const,
  svg: arrow,
}
const cont = {
  type: "text" as const,
  title: "continue",
}
const signupBtn = {
  type: "text" as const,
  title: "signup",
}
const more = {
  type: "svg" as const,
  svg: account,
}
// previous slide
const goBack = () => {
  emits('back');
}
// next slide
const goNext = () => {
  emits('next');
}
// try sign up
const trySignup = () => {
  emits('signup');
}
// btn
const currentButton = computed(() => {
  return props.toDisplay.signup ? signupBtn : cont;
})
</script>

<template>
  <div class="up-control">
    <div class="round" @click="goBack" :class="props.toDisplay.back ? 'show' : 'hidden'">
      <glass v-bind="back" />
    </div>
    <div class="wider" @click="goNext" :class="props.toDisplay.forward ? 'show' : 'hidden'" v-if="props.viewCurrent !== 3">
      <glass v-bind="currentButton" />
    </div>
    <div class="wider" @click="trySignup" :class="props.toDisplay.signup ? 'show' : 'hidden'" v-else>
      <glass v-bind="signupBtn" />
    </div>
    <div class="round" @click="router.push('/signin')" :class="props.toDisplay.profile ? 'show' : 'hidden'">
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
  gap: 0.5rem;
  position: absolute;
  bottom: calc(1.25 * var(--mm));
  left: calc(1.25 * var(--mm));
  z-index: 3;

  .wider, .round {
    height: 100%;
    color: var(--signup-main-text);
    position: relative;
    cursor: pointer;
  }

  .wider {
    flex: 1;
    font-weight: 500;
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
