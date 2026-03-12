<script setup lang="ts">
import router from "../../app_settings/router";
import arrow from "../../public/svg/arrow.vue";
import account from "../../public/svg/account.vue";
const emits = defineEmits(["next"]);
</script>

<template>
  <div class="controls">
    <div class="border back" @click="router.push('/signup')">
      <arrow color="var(--text-a)" :rotate="0" />
    </div>
    <div class="border next" @click="emits('next')"></div>
    <div class="border account">
      <account :color="'var(--accent)'" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.controls {
  width: calc(100% - 2rem);
  margin: auto 1rem 1rem;
  display: flex;
  gap: 0.75rem;
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: 0;

  .border {
    height: 3rem;
    border-radius: 1.5rem;
    border: 1px solid var(--liquid-glass-border);
    background: var(--back-b);
    box-shadow: var(--box-shadow);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .next, .back {
    top: 0;
    position: relative;
    transition: 0.2s;
  }

  .next {
    font-size: var(--mm);
    color: var(--text-a);
    flex: 1;
  }

  .next::after {
    content: var(--log-in);
  }

  .back {
    padding: 0.25rem;
  }

  .back, .account {
    width: 3rem;
  }

  .account {
    opacity: 0;
    pointer-events: none;
    padding: 0.75rem;
  }
}
</style>
