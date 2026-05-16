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
  <div class="w-100 h-100 max-w-1080 flex-c j-c pos-r g-05">
    <vSwitcherTrio :construct="sportView" v-model="sportMode" />
    <TransitionGroup name="sport" tag="div" class="w-100 h-100 max-w-1080 pos-r g-1">
      <div class="pos-a w-100 h-100 header-pad overflow-y-auto flex-c g-05" :key="0" v-show="sportMode === 'history'">
        <history />
      </div>
      <div class="pos-a w-100 h-100 header-pad overflow-y-auto flex-c g-05" :key="1" v-show="sportMode === 'workout'">
        <workout />
      </div>
      <div class="pos-a w-100 h-100 header-pad overflow-y-auto flex-c g-05" :key="2" v-show="sportMode === 'exercises'">
        <exercises />
      </div>
    </TransitionGroup>
  </div>
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
</style>
