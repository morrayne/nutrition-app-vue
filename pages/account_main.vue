<script setup lang="ts">
// MAIN IMPORTS
// vue & switcher
import { computed } from "vue";
import switcher from "../src/inputs/switcher.vue";
// ui & router
import profile_preview from "./account/profile_preview.vue";
import router from "../app_settings/router";
// store
import { useUserStore } from "../stores/useUserStore";
import { useAuthStore } from "../stores/useAuthStore";
const userStore = useUserStore();
const authStore = useAuthStore();

// CONTENT
// vars
const switcher_data = {
  theme: {
    name: "theme",
    value: userStore.userData.config.theme,
    option1: "light",
    option2: "dark"
  },
  lang: {
    name: "language",
    value: userStore.userData.config.lang,
    option1: "en",
    option2: "ru"
  },
  monochrome: {
    name: "monochrome",
    value: userStore.userData.config.monochrome,
    option1: "mono",
    option2: "multi"
  }
};

// updating function
const updateSetting = (field: string, value: string) => {
  if (field === 'theme') {
    userStore.setTheme(value as 'light' | 'dark');
    document.documentElement.setAttribute('theme', value);
  } else if (field === 'lang') {
    userStore.setLang(value as 'en' | 'ru');
    document.documentElement.setAttribute('lang', value);
  } else if (field === 'monochrome') {
    userStore.setMonochrome(value as 'mono' | 'multi');
    document.documentElement.setAttribute('monochrome', value);
  }
};

// COMPUTED AND FUNCTIONS
// log out
const handleLogout = async () => {
  await authStore.signOut();
  router.push("/signup");
};

// icons loading
const avatarUrl = computed(() => {
  if (userStore.availableAvatars.length === 0) { return "" }
  const index = userStore.userData.common.icon;
  return userStore.availableAvatars[index];
});

// 
const arr = ['app config', 'subscription upgrade', 'pick new icon', 'language swap', 'theme change', 'monochrome options', 'find friends']
</script>

<template>
  <div class="a">
    <profile_preview :data="false"></profile_preview>
    <div class="settings">
      <div class="item" v-for="value in arr">
        <p>{{ value }}</p>
        <div class="dot"></div>
      </div>
      <!-- <switcher :data="switcher_data.theme" field="theme" @infoInput="updateSetting" /> -->
      <!-- <switcher :data="switcher_data.lang" field="lang" @infoInput="updateSetting" /> -->
      <!-- <switcher :data="switcher_data.monochrome" field="monochrome" @infoInput="updateSetting" /> -->
    </div>
    <button class="logout" @click="handleLogout"></button>
  </div>
</template>

<style scoped lang="scss">
.a {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--back-a);
  gap: 0.75rem;
  padding: 0.5rem 0.75rem 0.75rem;

  // .settings {
  //   background: var(--back-b);
  //   display: flex;
  //   border-radius: 0.75rem;
  //   flex-direction: column;
  //   gap: 0.75rem;
  //   padding: 1rem 0.75rem;
  // }

  .settings {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: solid 2px var(--back-b);
      cursor: pointer;

      p {
        margin-left: 1rem;
        color: var(--text-b);
      }

      .dot {
        margin-right: 1rem;
        height: 0.5rem;
        border-radius: 50%;
        aspect-ratio: 1 / 1;
        background: var(--back-c);
      }
    }
  }

  .logout {
    color: var(--back-a);
    padding: 0.5rem 0;
    background: var(--text-a);
    border-radius: 0.75rem;
    margin-top: auto;
  }
  .logout::after {
    content: var(--logout);
  }
}
</style>
