<script setup lang="ts">
// IMPORT
// ui
import glass from "@/common/ui/glass.vue";
import arrow from "@/common/svg/arrow.vue";
// router
import router from "../../appSettings/router";

// CONTENT
const emit = defineEmits<{
  (e: 'trySignIn'): void
}>()
const handleSignIn = () => {
  emit('trySignIn');
}
// vars
const back = {
  type: "svg" as const,
  svg: arrow,
}
const signin = {
  type: "text" as const,
  title: "signup",
}
</script>

<template>
  <div class="up-control">
    <div class="round" @click="router.push('/signup')">
      <glass v-bind="back" />
    </div>
    <div class="wider" @click="handleSignIn">
      <glass v-bind="signin" />
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
