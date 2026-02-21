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

// username and email
const userEmail = computed(() => userStore.userData.common.email);
const username = computed(() => userStore.userData.common.username);
</script>

<template>
  <div class="a">
    <profile_preview :data="false"></profile_preview>
    <div class="settings">
      <switcher :data="switcher_data.theme" field="theme" @infoInput="updateSetting" />
      <switcher :data="switcher_data.lang" field="lang" @infoInput="updateSetting" />
      <switcher :data="switcher_data.monochrome" field="monochrome" @infoInput="updateSetting" />
    </div>
    <button class="logout" @click="handleLogout"></button>
  </div>
</template>

<style scoped lang="scss">
.a {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0.75rem;

  

  .settings {
    background: var(--back-b);
    display: flex;
    border-radius: 0.75rem;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 0.75rem;
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
