// IMPORT
// vue & pinia
import { ref, computed } from "vue";
import { defineStore } from "pinia";
// supabase
import { supabase } from "../appSettings/supabase";
import type { AuthError, Session, User } from "@supabase/supabase-js";
// store
import { useCommonStore } from "./useCommonStore";
import { useConfigStore } from "./useConfigStore";
import { useBodyStore } from "./useBodyStore";
import { useGoalStore } from "./useGoalStore";
import { useHistoryStore } from "./useHistoryStore";
// type
import type { tAuth, tCommon, tConfig, tBody, tGoal } from "./types";

// 
const getRandomAvatarIndex = (): number => {
  const min = 0;
  const max = 27;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// STORE
export const useAuthStore = defineStore("auth", () => {
  // STATE
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isInitialized = ref(false);
  const isAuthenticated = computed(() => !!user.value);
  const userEmail = computed(() => user.value?.email);
  const userId = computed(() => user.value?.id);
  const uid = computed(() => user.value?.id);
  const isReady = computed(() => !isLoading.value && isInitialized.value);

  // ACTION
  // load user data
  const loadUserData = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase.from("common").select("*").eq("user_id", userId).maybeSingle();
      if (profileError) {
        console.error("Error loading profile:", profileError);
        await signOut();
        return;
      }
      const { data: config } = await supabase.from("config").select("*").eq("user_id", userId).maybeSingle();
      const { data: body } = await supabase.from("body").select("*").eq("user_id", userId).maybeSingle();
      const { data: goal } = await supabase.from("goal").select("*").eq("user_id", userId).maybeSingle();
      const { data: history } = await supabase.from("history").select("*").eq("user_id", userId).maybeSingle();
      await updateStoresFromProfile(profile, config, body, goal, history);
    } catch (err) {
      console.error("Error loading user data:", err);
      error.value = (err as Error).message;
    }
  };
  // update stores
  const updateStoresFromProfile = async (profile: any, config: any, body: any, goal: any, history: any) => {
    const commonStore = useCommonStore();
    const configStore = useConfigStore();
    const bodyStore = useBodyStore();
    const goalStore = useGoalStore();
    const historyStore = useHistoryStore();
    commonStore.setProfile(profile);
    if (body) bodyStore.setBodyData(body);
    if (goal) goalStore.updateGoal(goal);
    if (history) {
      historyStore.history = { ...historyStore.history, ...history };
      await historyStore.updateHistory();
    }
    if (config) {
      configStore.setConfig(config);
      configStore.applyConfig(config);
    }
  };

  // AUTH ACTIONS
  // initialize
  const initialize = async () => {
    if (isInitialized.value) return;
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      session.value = currentSession;
      user.value = currentSession?.user ?? null;
      if (user.value) await loadUserData(user.value.id);
      else clearLocalStores();
      isInitialized.value = true;
    } catch (err) {
      console.error("Auth initialization error:", err);
      error.value = (err as Error).message;
      clearLocalData();
    } finally {
      isLoading.value = false;
    }
  };
  // create user profile
  const createUserProfile = async (common: tCommon, config: tConfig, body: tBody, goal: tGoal, user_id: string) => {
    try {
      const commonWithId = { ...common, user_id: user_id, icon: getRandomAvatarIndex(), sub_tier: 0, online: true, first_login: false };
      const { error: profileError } = await supabase.from("common").insert(commonWithId);
      if (profileError) throw profileError;
      const configWithId = { ...config, user_id: user_id };
      const { error: configError } = await supabase.from("config").insert(configWithId);
      if (configError) throw configError;
      const bodyWithId = { ...body, user_id: user_id };
      const { error: bodyError } = await supabase.from("body").insert(bodyWithId);
      if (bodyError) throw bodyError;
      const goalWithId = { ...goal, user_id: user_id };
      const { error: goalError } = await supabase.from("goal").insert(goalWithId);
      if (goalError) throw goalError;
      // history table
      const today = new Date().toISOString().split('T')[0];
      const weightHistoryRecord = {
        date: today,
        weight: body.weight,
        bf: body.bf 
      };
      const historyWithId = { user_id: user_id, active_days: [today], meals: [], weight: [weightHistoryRecord]};
      const { error: historyError } = await supabase.from("history").insert(historyWithId);
      if (historyError) throw historyError;
    } catch (err) {
      console.error("Failed to create user profile:", err);
      throw err;
    }
  };
  // signup
  const signUp = async (auth: tAuth, common: tCommon, config: tConfig, body: tBody, goal: tGoal,) => {
    isLoading.value = true;
    error.value = null;
    const email = auth.email;
    const password = auth.password;
    const username = auth.username;
    try {
      const { data, error: supabaseError } = await supabase.auth.signUp({ email, password, options: { data: { username }}});
      if (supabaseError) throw supabaseError;
      if (!data.session) return { success: true };
      if (data.user) {
        session.value = data.session;
        user.value = data.user;
        await createUserProfile(common, config, body, goal, data.user.id);
        await loadUserData(data.user.id);
      }
      return { success: true, data };
    } catch (err) {
      error.value = (err as AuthError).message;
      return { success: false, error: err };
    } finally {
      isLoading.value = false;
    }
  };
  // sign in
  const signIn = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({ email, password });
      if (supabaseError) throw supabaseError;
      session.value = data.session;
      user.value = data.user;
      if (data.user) {
        await loadUserData(data.user.id);
        const commonStore = useCommonStore();
        await commonStore.setOnline(true);
      }
      return { success: true, data };
    } catch (err) {
      error.value = (err as AuthError).message;
      return { success: false, error: err };
    } finally {
      isLoading.value = false;
    }
  };
  // sign out
  const signOut = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const commonStore = useCommonStore();
      await commonStore.setOnline(false);
      const { error: supabaseError } = await supabase.auth.signOut();
      if (supabaseError) throw supabaseError;
      clearLocalData();
      return { success: true };
    } catch (err) {
      error.value = (err as AuthError).message;
      return { success: false, error: err };
    } finally {
      isLoading.value = false;
    }
  };

  // LISTENERS & HELPERS
  const clearLocalStores = () => {
    const commonStore = useCommonStore();
    const configStore = useConfigStore();
    const bodyStore = useBodyStore();
    const goalStore = useGoalStore();
    const historyStore = useHistoryStore();
    commonStore.clearProfile();
    configStore.resetToDefaults();
    bodyStore.clearBodyData?.();
    goalStore.clearGoal?.();
    historyStore.clearHistory?.(); 
  document.documentElement.setAttribute("data-theme", "light");
  document.documentElement.setAttribute("lang", "en");
  document.documentElement.setAttribute("data-palette", "colorful");
  document.documentElement.setAttribute("data-phone-color", "blue");
  document.documentElement.setAttribute("data-mm", "16");
  };
  // 
  const clearLocalData = () => {
    user.value = null;
    session.value = null;
    clearLocalStores();
  };

  // EXPORTS
  return { user, session, isLoading, error, isInitialized, isAuthenticated, userEmail, userId, uid, isReady, initialize, signUp, signIn, signOut };
});