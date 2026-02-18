<script setup lang="ts">
// MAIN IMPORTS
// vue
import { ref } from "vue";
// ui
import switcher from "@/ui/switcher.vue";

// PROPS & EMITS
// props
const props = defineProps(["userData"]);
// emits
const emit = defineEmits(["update-field"]);

// MAIN VARS
const data = ref({
  theme: {
    name: "theme",
    value: "light",
    option1: "light",
    option2: "dark",
  },
  lang: {
    name: "language",
    value: "en",
    option1: "en",
    option2: "ru",
  },
  monochrome: {
    name: "monochrome",
    value: "mono",
    option1: "mono",
    option2: "multi",
  },
});

// FUNCTIONS
// health_data emit
const UpdateField = (field: string, value: string) => {
  emit("update-field", { field, value });
};
// information moderation
const checkInfo = (field: string, value: string) => {
  if (field === "theme") {
    if (value === "light" || value === "dark") {
      data.value.theme.value = value;
      UpdateField("theme", value);
      document.documentElement.setAttribute("theme", value);
    }
  } else if (field === "lang") {
    if (value === "en" || value === "ru") {
      data.value.lang.value = value;
      UpdateField("lang", value);
      document.documentElement.setAttribute("lang", value);
    }
  } else if (field === "monochrome") {
    if (value === "mono" || value === "multi") {
      data.value.monochrome.value = value;
      UpdateField("monochrome", value);
      document.documentElement.setAttribute("monochrome", value);
    }
  }
};
</script>

<template>
  <div class="w">
    <switcher :data="data.theme" field="theme" @infoInput="checkInfo" />
    <switcher :data="data.lang" field="lang" @infoInput="checkInfo" />
    <switcher :data="data.monochrome" field="monochrome" @infoInput="checkInfo" />
  </div>
</template>

<style scoped>
.w {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.w {
  padding: 1rem;
  position: relative;
}
</style>
