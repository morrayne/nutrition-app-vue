<script setup lang="ts">
import { ref } from "vue";
import switcher from "@/inputs/switcher.vue";
const display = ref({
  value: "basket",
  option1: "basket",
  option2: "list",
});

const getSwitcherValue = (option: string) => {
  display.value.value = option;
};
</script>

<!-- prettier-ignore -->
<template>
  <div class="menu">
    <div class="cover">
      <switcher :data="display" field="nothing" @info-input="getSwitcherValue"></switcher>
      <div class="both" :style="{transform: display.value === 'basket' ? 'translateX(0%)' : 'translateX(-100%)'}">
        <div class="basket">
          <button @click="" class="send">Send it</button>
        </div>
        <div class="list"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menu {
  height: 100%;
  background: var(--back-a);
  gap: 0.25rem;
  padding: 0.5rem 0.75rem 0.75rem;

  .cover {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .both {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;

    .basket,
    .list {
      min-width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .basket {
      .send {
        color: var(--back-a);
        padding: 0.5rem 0;
        background: var(--text-a);
        border-radius: 0.75rem;
        margin-top: auto;
      }
    }
  }
}
</style>
