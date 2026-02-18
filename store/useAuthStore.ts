// MAIN IMPORTS
// vue
import { ref, computed } from "vue";
// pinia
import { defineStore } from "pinia";
// supabase
import { supabase } from "../utils/supabase";
import type { AuthError, Session, User } from "@supabase/supabase-js";
// types
import type { username_icon_type, sub_type, user_body_type, macros_type, config_friends_type } from './store_types';
// store
import { useUserStore } from "./useUserStore";
import { useUserPrivateStore } from "./useUserPrivateStore";

export const useAuthStore = defineStore("auth", () => {
  // SUPABASE STATE
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isInitialized = ref(false);

  // GETTERS
  const isAuthenticated = computed(() => !!user.value);
  const userEmail = computed(() => user.value?.email);
  const userId = computed(() => user.value?.id);
  const uid = computed(() => user.value?.id);
  const isReady = computed(() => !isLoading.value && isInitialized.value);

  // SUPABASE ACTIONS
  // session restore
  const initialize = async () => {
    if (isInitialized.value) return;
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      session.value = currentSession;
      user.value = currentSession?.user ?? null;
      if (user.value) {
        await loadUserData(user.value.id);
      } else {
        clearLocalStores();
      }
      setupAuthListener();
      isInitialized.value = true;
      console.log(`📡 User initializated: ${user.value?.id}`);
    } catch (err) {
      console.error("Auth initialization error:", err);
      error.value = (err as Error).message;
      clearLocalData();
    } finally {
      isLoading.value = false;
    }
  };
  // load user profile
  const loadUserData = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (profileError || !profile) {
        console.error("Error loading profile:", profileError);
        await signOut();
        return;
      }
      updateStoresFromProfile(profile);
    } catch (err) {
      console.error("Error loading user data:", err);
      error.value = (err as Error).message;
      await signOut();
    }
  };
  // register
  const signUp = async (email: string, password: string, username: string, lang: "ru" | "en", theme: "light" | "dark", monochrome: "mono" | "multi") => {
    isLoading.value = true; error.value = null;
    try {
      const { data, error: supabaseError } = await supabase.auth.signUp({ email, password, options: { data: { username: username }}});
      if (supabaseError) throw supabaseError;
      if (!data.session) { return { success: true, message: "Registration done!" }}
      if (data.user) {
        session.value = data.session;
        user.value = data.user;
        await createUserProfile(data.user, username, lang, theme, monochrome);
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
  // log in
  const signIn = async (email: string, password: string) => {
    isLoading.value = true; error.value = null;
    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({ email, password });
      if (supabaseError) throw supabaseError;
      session.value = data.session;
      user.value = data.user;
      if (data.user) { await loadUserData(data.user.id) }
      return { success: true, data };
    } catch (err) {
      error.value = (err as AuthError).message;
      return { success: false, error: err };
    } finally {
      isLoading.value = false;
    }
  };
  // log out
  const signOut = async () => {
    isLoading.value = true; error.value = null;
    try {
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
  // supabase data save
  const saveUserData = async () => {
    if (!user.value) { return { success: false, error: "User not authenticated" }}
    try {
      const userStore = useUserStore();
      const userPrivateStore = useUserPrivateStore();
      const userData = userStore.getUserData();
      const { error: supabaseError } = await supabase.from("profiles").update({
        username: userData.common.username,
        icon: userData.common.icon,
        first_login: userData.common.firstLogin,
        subscription_tier: userData.subscription.tier,
        lang: userPrivateStore.privateData.lang,
        theme: userPrivateStore.privateData.theme,
        monochrome: userPrivateStore.privateData.monochrome,
        friends: userPrivateStore.privateData.friends,
        body_data: { gender: userData.body.gender, current: userData.body.current, goal: userData.body.goal },
        macros_data: userData.macros,
      }).eq("id", user.value.id);
      if (supabaseError) throw supabaseError;
      return { success: true };
    } catch (err) {
      console.error("Error saving user data:", err);
      return { success: false, error: (err as Error).message };
    }
  };

  // PRIVATE METHODS
  // creating a profile
  const createUserProfile = async (userData: User, username: string,lang: "ru" | "en", theme: "light" | "dark", monochrome: "mono" | "multi") => {
    try {
      const { error } = await supabase.from("profiles").insert({
        id: userData.id,
        username: username,
        icon: 0,
        first_login: false,
        subscription_tier: 0,
        lang: lang,
        theme: theme,
        monochrome: monochrome,
        friends: [],
        body_data: {
          gender: "male",
          current: {
            age: 21,
            height: 180,
            activity: 1.45,
            weight: 72,
            bf: 10,
          },
          goal: { weight: 82, bf: 8 },
        },
        macros_data: { kcal: 0, proteins: 0, carbs: 0, fats: 0 },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Failed to create user profile:", err);
      throw err;
    }
  };
  // updating store from profile data
  const updateStoresFromProfile = (profile: any) => {
    const userStore = useUserStore();
    const userPrivateStore = useUserPrivateStore();
    userStore.updateCommon({ username: profile.username, icon: profile.icon || 0, firstLogin: profile.first_login ?? false,});
    userStore.updateSubscription(profile.subscription_tier || 0);
    if (profile.body_data) {
      userStore.updateBodyCurrent(profile.body_data.current || {});
      userStore.updateBodyGoal(profile.body_data.goal || {});
      if (profile.body_data.gender) { userStore.updateGender(profile.body_data.gender) }
    }
    if (profile.macros_data) { userStore.calculateMacros(profile.macros_data) }
    userPrivateStore.updatePrivateData({
      email: user.value?.email || "",
      lang: profile.lang || "ru",
      theme: profile.theme || "light",
      monochrome: profile.monochrome || "mono",
      friends: profile.friends || [],
    });
  };
  // setup auth listener
  const setupAuthListener = () => {
    supabase.auth.onAuthStateChange((event, newSession) => {
      session.value = newSession; user.value = newSession?.user ?? null;
      switch (event) {
        case "SIGNED_IN":
          if (newSession?.user) { loadUserData(newSession.user.id)}
          break;
        case "SIGNED_OUT":
          clearLocalData();
          break;
        case "USER_UPDATED":
          if (newSession?.user) { user.value = newSession.user}
          break;
      }
    });
  };
  
  // HELPER FUNCTIONS
  // clear local stores
  const clearLocalStores = () => {
    const userStore = useUserStore();
    const userPrivateStore = useUserPrivateStore();
    userStore.clearUserData();
    userPrivateStore.clearPrivateData();
  }; 
  // clear local data
  const clearLocalData = () => {
    user.value = null;
    session.value = null;
    clearLocalStores();
  };

  // EXPORTS
  return {
    // state
    user, session, isLoading, error, isInitialized,
    // Getters
    isAuthenticated, userEmail, userId, uid, isReady,
    // Actions
    initialize, signUp, signIn, signOut, saveUserData,
  };
});
