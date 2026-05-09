<script setup lang="ts">
import { today } from "../../appSettings/export/default";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const macros = [
  { title: "shortCalories", color: "var(--pu)" },
  { title: "shortProteins", color: "var(--pi)" },
  { title: "shortFats", color: "var(--ye)" },
  { title: "shortCarbs", color: "var(--gr)" },
];

import macroWidget from "../meal/ui/macroWidget.vue";
</script>

<template>
  <div class="w-100 h-fit max-w-1080 header-pad flex-c pos-r g-1 overflow-y-auto scroll-style">
    <macroWidget :date="today" />
    <p class="fs-xl fw-7">{{ t("suggestions") }}</p>
    <div class="w-100 def-wrap suggestions-wrap"></div>
    <p class="fs-xl fw-7">{{ t("lastMonth") }}</p>
  </div>
</template>

<style scoped lang="scss">
// .today-wrap {
//   display: grid;
//   grid-template-columns: repeat(1, 1fr);
//   .macros-wrap {
//     padding: 1rem;
//     display: grid;
//     grid-template-columns: repeat(2, 1fr);
//     .macros-block {
//       gap: 0.25rem;
//       .j-b {
//         .title,
//         .value {
//         }
//         .title {
//           color: var(--ex-color);
//         }
//         // .value {}
//       }
//       .w-100 .item {
//         height: 0.5rem;
//         border-radius: 0.5rem;
//       }
//     }
//   }
// }
.suggestions-wrap {
  height: 8rem;
}
</style>
