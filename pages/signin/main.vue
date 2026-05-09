<script setup lang="ts">
import { ref } from "vue";

import type { tSignTable } from "../../appSettings/types/store";
import vInput from "../../components/form/vInput.vue";
import { email, password } from "../../appSettings/export/vInput";

const signinData = ref<tSignTable>({
  email: "",
  password: "",
});

import navigation from "../../components/navigation/signin.vue";
</script>

<template>
  <navigation v-model="signinData" />
  <form class="w-100 h-100 flex-c j-c max-w-640 pos-r g-1">
    <vInput :construct="email" v-model="signinData.email" />
    <vInput :construct="password" v-model="signinData.password" />
  </form>
</template>

<style scoped lang="scss"></style>
