<script setup lang="ts">
import end from '../ui/end.vue';
import localText from "../ui/localText.vue";
import fire from './homeFolder/fire.vue';
const today = new Date().toISOString().split("T")[0]!.replace(/-/g, ".");
import { useCommonStore } from "../../stores/single/useCommonStore";
const commonStore = useCommonStore();
import { useConfigStore } from "../../stores/single/useConfigStore";
const configStore = useConfigStore();
import { useAuthStore } from "../../stores/main/useAuthStore";
const authStore = useAuthStore();
import router from "../../appSettings/router";

import type { tConfig } from '../../stores/main/types';
import type { tRowSwitch } from '../form/rowSwitch.vue';
import type { tColSelect, tColSelectOpt } from '../form/colSelect.vue';
import colSelect from '../form/colSelect.vue';
import rowSwitch from '../form/rowSwitch.vue';

const updateConfig = async (key: keyof tConfig, value: any) => {
  const newConfig = { ...configStore.config, [key]: value };
  configStore.setConfig(newConfig);
  configStore.changeVisualViaConfig(newConfig);
  await configStore.updateConfig();
};
const languageOpt: tColSelectOpt[] = [
  { title: "english", toEmit: "en" },
  { title: "russian", toEmit: "ru" },
  { title: "espaniol", toEmit: "es" },
  { title: "mandarin", toEmit: "zh" },
];
const language: tColSelect = {
  title: "language",
  data: {
    type: "string" as const,
    start: languageOpt.findIndex(opt => opt.toEmit === configStore.config.language),
    options: languageOpt,
  },
};
const theme: tRowSwitch = {
  title: "dark-mode",
  data: {
    type: "text",
    start: configStore.config.theme === 'light' ? "off" : "on",
    on: "dark",
    off: "light",
  },
};
const newremOpt: tColSelectOpt[] = [
  { title: "very-small", toEmit: 14 },
  { title: "small", toEmit: 15 },
  { title: "medium", toEmit: 16 },
  { title: "big", toEmit: 17 },
  { title: "large", toEmit: 18 },
];
const newrem: tColSelect = {
  title: "font-size",
  desc: "recomended-font",
  data: {
    type: "number" as const,
    start: newremOpt.findIndex(opt => opt.toEmit === Number(configStore.config.newrem)),
    options: newremOpt,
  },
};
const phoneColorOpt: tColSelectOpt[] = [
  { title: "black", toEmit: "black" },
  { title: "white", toEmit: "white" },
  { title: "green", toEmit: "green" },
  { title: "blue", toEmit: "blue" },
  { title: "purple", toEmit: "purple" },
];
const phoneColor: tColSelect = {
  title: "phone-color",
  desc: "pc-only",
  data: {
    type: "string" as const,
    start: phoneColorOpt.findIndex(opt => opt.toEmit === configStore.config.phoneColor),
    options: phoneColorOpt,
  },
};
const handleSignOut = async () => {
  await authStore.signOut();
  router.push("/signup");
};
</script>

<template>
  <div class="screen default-screen account">
    <!-- account -->
    <localText text="account" :weight="500" size="l" />
    <div class="mini-wrap mini-profile">
      <div class="left">
        <div class="filler"></div>
        <img src="" alt="" v-if="false">
      </div>
      <div class="right">
        <div class="username">{{ commonStore.common.username }}</div>
        <div class="email">{{ commonStore.common.email }}</div>
      </div>
    </div>
    <fire :today="today" />
    <!-- settings -->
    <localText text="settings" :weight="500" size="l" />
    <colSelect v-bind="language" :modelValue="configStore.config.language" @update:modelValue="updateConfig('language', $event)" />
    <rowSwitch v-bind="theme" :modelValue="configStore.config.theme" @update:modelValue="updateConfig('theme', $event)" />
    <colSelect v-bind="newrem" :modelValue="configStore.config.newrem" @update:modelValue="updateConfig('newrem', $event)" />
    <colSelect v-bind="phoneColor" :modelValue="configStore.config.phoneColor" @update:modelValue="updateConfig('phoneColor', $event)" />
    <!-- sign out -->
    <button class="mini-wrap sign-out-btn" @click="handleSignOut">
      <localText text="signout" size="m" />
    </button>
    <end />
  </div>
</template>

<style scoped lang="scss">
.account {
  .mini-profile {
    gap: 1rem;
    .left {
      .filler {
        width: calc(1.5 * (var(--size-s) + var(--size-m)));
        height: calc(1.5 * (var(--size-s) + var(--size-m)));
        background: var(--ex-background);
        border-radius: 50%;
      }
      // img {}
    }
    .right {
      flex-direction: column;
      justify-content: space-between;
      .username {
        font-weight: 500;
      }
      .email {
        font-size: var(--size-s);
        color: var(--ex-color);
      }
    }
  }
  .sign-out-btn {
    background: var(--re);
    border: solid 1px var(--re);
    color: white;
    justify-content: center;
  }
}
</style>
