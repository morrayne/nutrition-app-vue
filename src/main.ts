// MAIN IMPORTS
// vue & app
import App from "./App.vue";
import { createApp } from "vue";
import { useTheme } from "../app_settings/use_theme";
const app = createApp(App);
// router & pinia
import { createPinia } from "pinia";
const pinia = createPinia();
app.use(pinia);
import router from "../app_settings/router";
app.use(router);
// store
import { useAuthStore } from "../stores/useAuthStore";
import { useUserStore } from "../stores/useUserStore";

// FUNCTION
// online flag management
const flag_manager = async (data: boolean) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  if (data && authStore.isAuthenticated && authStore.user) {
    try {
      userStore.setUserData({ ...userStore.userData, online: true });
      await authStore.saveUserData();
    } catch (error) {
      console.error("Failed to update online status:", error);
    }
  } else if (!data && authStore.isAuthenticated && authStore.user) {
    try {
      userStore.setUserData({ ...userStore.userData, online: false });
      const blob = new Blob([JSON.stringify({ online: false })], {type: 'application/json'});
      navigator.sendBeacon(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${authStore.user.id}`, blob);
    } catch (error) {
      console.error("Failed to update offline status:", error);
    }
  }
};

// bootstrap
const bootstrap = async () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  userStore.loadAvailableAvatars();
  await authStore.initialize();
  await flag_manager(true);
  const { initialize: initializeTheme } = useTheme();
  initializeTheme();
  app.mount("#app");
  window.addEventListener('beforeunload', () => {flag_manager(false)});
  if (authStore.isAuthenticated) {
    router.push("/dashboard");
  } else {
    router.push("/signup");
  }
};

// APP START
bootstrap();
