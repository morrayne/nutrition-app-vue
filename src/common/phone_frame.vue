<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import navigation from "./navigation.vue";
import { useAuthStore } from "../../stores/useAuthStore";
const authStore = useAuthStore();
const phone_color = ref<string | null>(null);
const is_mobile = ref(false);
onMounted(() => {
  const element = document.querySelector("[data-phone-color]");
  if (element) phone_color.value = element.getAttribute("data-phone-color") || "blue";
  is_mobile.value = window.innerWidth <= 540;
});
const current_color = computed(() => {
  return phone_color_array.find((color) => color.name === phone_color.value);
});

interface phone_color_array_type {
  name: string;
  rgb: string;
}
const phone_color_array: phone_color_array_type[] = [
  { name: "black", rgb: "#6c6c6d" },
  { name: "white", rgb: "#f1f2ed" },
  { name: "green", rgb: "#c4cfa7" },
  { name: "blue", rgb: "#b5c6de" },
  { name: "purple", rgb: "#ebe2f1" },
];
</script>

<template>
  <div v-if="current_color && !is_mobile" class="frame">
    <div class="black-outline">
      <div class="bot">
        <navigation v-if="authStore.isAuthenticated" />
        <div class="content">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
  <div class="no-frame" v-if="current_color && is_mobile">
    <navigation v-if="authStore.isAuthenticated" />
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
:root[data-phone-color="black"] {
  --phone-bg: #6c6c6d;
}
:root[data-phone-color="white"] {
  --phone-bg: #f1f2ed;
}
:root[data-phone-color="green"] {
  --phone-bg: #c4cfa7;
}
:root[data-phone-color="blue"] {
  --phone-bg: #b5c6de;
}
:root[data-phone-color="purple"] {
  --phone-bg: #ebe2f1;
}
.frame {
  padding: 0.375rem;
  border-radius: 3.5rem;
  border: solid 3px #00000020;
  background: var(--phone-bg);
  position: relative;
  transition: 0.2s;

  .black-outline {
    width: 320px;
    aspect-ratio: 20 / 39;
    background: #000;
    outline: solid 3px #ffffff80;
    padding: 0.25rem;
    border-radius: 3.125rem;
    display: flex;
    flex-direction: column;
    position: relative;

    .bot {
      height: 100%;
      background: var(--back-a);
      border-radius: 2.875rem;
    }
  }
}
.no-frame {
  background: var(--phone-bg);
  position: relative;
}
.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 2.875rem;
  overflow: hidden;
  z-index: 2;
}
</style>
