import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "../../appSettings/supabase";
import type { AuthError, Session, User } from "@supabase/supabase-js";
import type { tAuth, tCommon, tConfig, tBody, tGoal } from "./types";
// array stores
import { useActiveDayStore } from "../array/useActiveDayStore";
import { useAssetStore } from "../array/useAssetStore";
import { useMealStore } from "../array/useMealStore";
// single stores
import { useBodyStore } from "../single/useBodyStore";
import { useCommonStore } from "../single/useCommonStore";
import { useConfigStore } from "../single/useConfigStore";
import { useGoalStore } from "../single/useGoalStore";

const getRandomAvatarIndex = (): number => {
  return Math.floor(Math.random() * 27);
};

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const isInitialized = ref(false);
  const isAuthenticated = computed(() => !!user.value);
  const userId = computed(() => user.value?.id);

  const getUserData = async () => {
    if (!user.value?.id) return;
    try {
      const commonStore = useCommonStore();
      const configStore = useConfigStore();
      const bodyStore = useBodyStore();
      const goalStore = useGoalStore();
      const activeDayStore = useActiveDayStore();
      const assetStore = useAssetStore();
      const mealStore = useMealStore();
      await Promise.all([commonStore.getCommon(), configStore.getConfig(), bodyStore.getBody(), goalStore.getGoal(), activeDayStore.getActiveDays(), assetStore.getAssets(), mealStore.getMeals()]);
    } catch (err) {
      console.error("Error at 'getUserData': ", err);
    }
  };

  const initialize = async () => {
    if (isInitialized.value) return;
    isLoading.value = true;
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      user.value = currentSession?.user ?? null;
      if (user.value) await getUserData();
      else clearLocalStores();
      isInitialized.value = true;
    } catch (err) {
      console.error("Error at 'initialize': ", err);
      clearLocalData();
    } finally {
      isLoading.value = false;
    }
  };

  const createUserProfile = async ( common: tCommon, config: tConfig, body: tBody, goal: tGoal) => {
    try {
      const commonStore = useCommonStore();
      const configStore = useConfigStore();
      const bodyStore = useBodyStore();
      const goalStore = useGoalStore();
      const activeDayStore = useActiveDayStore();
      const assetStore = useAssetStore();
      const mealStore = useMealStore();
      commonStore.setCommon({ ...common, icon: getRandomAvatarIndex(), online: true });
      configStore.setConfig(config);
      bodyStore.setBody(body);
      goalStore.setGoal(goal);
      await Promise.all([commonStore.updateCommon(), configStore.updateConfig(), bodyStore.updateBody(), goalStore.updateGoal(), activeDayStore.addToday(), assetStore.updateAssets(), mealStore.updateMeals()]);
    } catch (err) {
      console.error("Error at 'createUserProfile': ", err);
      throw err;
    }
  };

  const signUp = async (auth: tAuth, common: tCommon, config: tConfig, body: tBody, goal: tGoal) => {
    isLoading.value = true;
    const email = auth.email;
    const password = auth.password;
    const username = auth.username;
    try {
      const { data, error: supabaseError } = await supabase.auth.signUp({email, password, options: { data: { username } }});
      if (supabaseError) throw supabaseError;
      if (!data.session) return { success: true };
      if (data.user) {
        user.value = data.user;
        await createUserProfile(common, config, body, goal);
        await getUserData();
      }
      return { success: true, data };
    } catch (err) {
      console.error("Error at 'signUp': ", err);
      return { success: false, error: err };
    } finally {
      isLoading.value = false;
    }
  };

  const signIn = async (email: string, password: string) => {
    isLoading.value = true;
    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({ email, password });
      if (supabaseError) throw supabaseError;
      user.value = data.user;
      if (data.user) {
        await getUserData();
        const commonStore = useCommonStore();
        commonStore.setCommon({ ...commonStore.common, online: true });
        await commonStore.updateCommon();
      }
      return { success: true, data };
    } catch (err) {
      console.error("Error at 'signIn': ", err);
      return { success: false, error: err };
    } finally {
      isLoading.value = false;
    }
  };

  const signOut = async () => {
    isLoading.value = true;
    try {
      const commonStore = useCommonStore();
      commonStore.setCommon({ ...commonStore.common, online: false });
      await commonStore.updateCommon();
      const { error: supabaseError } = await supabase.auth.signOut();
      if (supabaseError) throw supabaseError;
      clearLocalData();
      return { success: true };
    } catch (err) {
      console.error("Error at 'signOut': ", err);
      return { success: false, error: err };
    } finally {
      isLoading.value = false;
    }
  };

  const clearLocalStores = () => {
    const commonStore = useCommonStore();
    const configStore = useConfigStore();
    const bodyStore = useBodyStore();
    const goalStore = useGoalStore();
    const activeDayStore = useActiveDayStore();
    const assetStore = useAssetStore();
    const mealStore = useMealStore();
    commonStore.clearCommon();
    configStore.clearConfig();
    bodyStore.clearBody();
    goalStore.clearGoal();
    activeDayStore.clearActiveDays();
    assetStore.clearAssets();
    mealStore.clearMeals();
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.setAttribute("lang", "en");
    document.documentElement.setAttribute("data-newrem", "16");
  };

  const clearLocalData = () => {
    user.value = null;
    clearLocalStores();
  };

  return { user, isLoading, isInitialized, isAuthenticated, userId, initialize, signUp, signIn, signOut };
});
