<script setup lang="ts">
import { ref } from "vue";

import vSwitcherTrio from "../../components/form/vSwitcherTrio.vue";
import { sportView } from "../../appSettings/export/form/vSwitcherTrio";
const sportMode = ref("history");

import exercises from "./view/exercises.vue";
import workout from "./view/workout.vue";
import history from "./view/history.vue";
</script>

<template>
  <TransitionGroup name="sport" tag="div" class="w-100 h-100 max-w-1440 pos-r">
    <div class="grid grid-2 g">
      <vSwitcherTrio :construct="sportView" v-model="sportMode" />
    </div>
    <div class="pos-a w-100 h-100 header-padding sport-padding over-y flex-c gap-50" :key="0" v-show="sportMode === 'history'">
      <history />
    </div>
    <div class="pos-a w-100 h-100 header-padding sport-padding over-y flex-c gap-50" :key="1" v-show="sportMode === 'workout'">
      <workout />
    </div>
    <div class="pos-a w-100 h-100 header-padding sport-padding over-y flex-c gap-50" :key="2" v-show="sportMode === 'exercises'">
      <exercises />
    </div>
  </TransitionGroup>
</template>

<style scoped lang="scss">
.sport-enter-from,
.sport-leave-to {
  opacity: 0;
}
.sport-enter-to,
.sport-leave-from {
  opacity: 1;
}
.g {
  z-index: 3;
}
.sport-padding {
  padding-top: 5rem;
}

@media (max-width: 1280px) {
  .sport-padding {
    padding-top: 4.5rem;
  }
}
@media (max-width: 640px) {
  .sport-padding {
    padding-top: 4rem;
  }
}
</style>
