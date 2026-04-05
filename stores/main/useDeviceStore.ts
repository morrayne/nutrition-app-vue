import { ref } from "vue";
import { defineStore } from "pinia";

export const useDeviceStore = defineStore("device", () => {
  const width = ref(window.innerWidth);
  const height = ref(window.innerHeight);
  const theme = ref<"light" | "dark">("light");
  
  const getSystemData = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    theme.value = prefersLight ? "light" : "dark";
  };
  const init = () => {
    window.addEventListener("resize", getSystemData);
  };
  const destroy = () => {
    window.removeEventListener("resize", getSystemData);
  };
  
  return { width, height, theme, getSystemData, init, destroy };
});
