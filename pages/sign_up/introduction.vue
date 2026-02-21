<script setup lang="ts">
const lia = ["prep-a1", "prep-a2", "prep-a3", "prep-a4", "prep-a5"];
const lib = ["prep-b1", "prep-b2", "prep-b3", "prep-b4"];
</script>

<template>
  <div class="prep">
    <p class="prep-intro"></p>
    <p class="prep-a"></p>
    <ul><li v-for="value in lia" :key="value" :style="{ '--item-text': `var(--${value})` }"></li></ul>
    <p class="prep-b"></p>
    <ul><li v-for="value in lib" :key="value" :style="{ '--item-text': `var(--${value})` }"></li></ul>
  </div>
</template>

<style scoped>
.prep {
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;

  .prep-intro {
    font-size: 1rem;
    font-weight: 500;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    padding: 0;

    li {
      padding: 0.25rem 0.5rem;
      font-size: 0.7rem;
      color: var(--text-b);
      background: var(--back-c);
      border: solid 1px var(--back-d);
      border-radius: 0.5rem;
      position: relative;
    }

    li::after {
      content: var(--item-text);
    }
  }

  .prep-a, .prep-b {
    margin: auto 0 0.5rem;
    font-size: 0.9rem;
    color: var(--text-a);
  }

  .prep-a::after {
    content: var(--prep-a);
  }

  .prep-b::after {
    content: var(--prep-b);
  }
}

.prep-intro::after {
  content: var(--prep-intro);
}
</style>
