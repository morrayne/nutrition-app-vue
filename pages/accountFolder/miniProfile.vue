<script setup lang="ts">
import { useCommonStore } from "../../stores";
const commonStore = useCommonStore();
</script>

<template>
  <div class="mini-profile">
    <div class="left">
      <img :src="commonStore.getAvatarUrl" alt="account-icon" />
    </div>
    <div class="right">
      <div class="top"> {{ commonStore.username }} </div>
      <div class="bot"> {{ commonStore.userEmail }} </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mini-profile {
  width: 100%;
  display: flex;
  gap: 1rem;
  padding: calc(0.5 * var(--mm));
  background: var(--signup-sub-background);
  border: solid 1px var(--signup-main-border);
  border-radius: calc(2.25 * var(--mm));

  .left {
    width: calc(2.75 * var(--mm));
    height: calc(2.75 * var(--mm));

    img {
      height: 100%;
      border-radius: 50%;
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    gap: calc(0.5 * var(--mm));

    .top {
      color: var(--signup-main-text);
    }

    .bot {
      color: var(--signup-sub-border);
      font-size: calc(0.75 * var(--mm));
    }
  }
}
</style>
