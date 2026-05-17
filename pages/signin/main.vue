<script setup lang="ts">
import { ref } from "vue";

import navigation from "../../components/navigation/signin.vue";
import loadingWrap from "../../components/wraps/loading.vue";
const loading = ref<boolean>(false);

import type { tSignTable } from "../../appSettings/export/types/store";
import vInputString from "../../components/form/vInputString.vue";
import { email, password } from "../../appSettings/export/form/vInputString";

const signinData = ref<tSignTable>({
  email: "",
  password: "",
});
</script>

<template>
  <loadingWrap v-if="loading" />
  <navigation v-model="signinData" :loading="loading" @loading="loading = !loading" />
  <form class="w-100 h-100 flex-c jus-c max-w-640 pos-r gap-100">
    <vInputString :construct="email" v-model="signinData.email" />
    <vInputString :construct="password" v-model="signinData.password" />
  </form>
</template>

<style scoped lang="scss"></style>
