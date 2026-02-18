<script setup lang="ts">
// MAIN IMPORTS
// vue & switcher & router
import { computed } from "vue";
import switcher from "@/ui/switcher.vue";
import router from "../utils/router";
// store
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";
import { useUserPrivateStore } from "../store/useUserPrivateStore";
const userStore = useUserStore();
const authStore = useAuthStore();
const userPrivateStore = useUserPrivateStore();

// SWITCHERS DATA
// vars
const switcher_data = {
  theme: {
    name: "theme",
    value: userPrivateStore.privateData.theme,
    option1: "light",
    option2: "dark"
  },
  lang: {
    name: "language",
    value: userPrivateStore.privateData.lang,
    option1: "en",
    option2: "ru"
  },
  monochrome: {
    name: "monochrome",
    value: userPrivateStore.privateData.monochrome,
    option1: "mono",
    option2: "multi"
  }
};
// updating function
const updateSetting = (field: string, value: string) => {
  if (field === 'theme') {
    userPrivateStore.setTheme(value as 'light' | 'dark');
    document.documentElement.setAttribute('data-theme', value);
  } else if (field === 'lang') {
    userPrivateStore.setLang(value as 'en' | 'ru');
    document.documentElement.setAttribute('lang', value);
  } else if (field === 'monochrome') {
    userPrivateStore.setMonochrome(value as 'mono' | 'multi');
    document.documentElement.setAttribute('data-monochrome', value);
  }
};

// COMPUTED AND FUNCRIONS
// log out
const handleLogout = async () => {
  await authStore.signOut();
  router.push("/health");
};
// icons loading
const avatarUrl = computed(() => {
  if (userStore.availableAvatars.length === 0) { return "" }
  const index = userStore.common.icon;
  return userStore.availableAvatars[index];
});
// username and email
const userEmail = computed(() => authStore.userEmail);
const username = computed(() => userStore.common.username);
</script>

<template>
  <div class="a">
    <div class="top">
      <div class="img-holder" v-if="avatarUrl">
        <img :src="avatarUrl" alt="profile icon" class="icon" />
      </div>
      <div class="text-w">
        <div class="email">{{ userEmail }}</div>
        <div class="username">{{ username }}</div>
      </div>
    </div>
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

  .top {
    width: 100%;
    height: 4rem;
    background: var(--back-b);
    border-radius: 0.75rem;
    padding: 0.5rem;
    display: flex;
    gap: 1rem;

    .img-holder {
      width: 3rem;
      height: 3rem;
      overflow: hidden;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        scale: 1.1;
      }
    }

    .text-w {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .email {
        font-size: 0.95rem;
        color: var(--text-a);
      }

      .username {
        font-size: 0.85rem;
        color: var(--text-c);
      }
    }
  }

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
