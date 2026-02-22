// MAIN IMPORTS
// vue & pinia
import { ref, computed } from "vue";
import { defineStore } from "pinia";
// supabase & stores
import { supabase } from "../app_settings/supabase";
import type { AuthError, Session, User } from "@supabase/supabase-js";
import { useUserStore } from "./useUserStore";
import type { new_format } from "./store_types";
// random icon generator
const getRandomAvatarIndex = (): number => {
  const min = 0;
  const max = 27;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// STORE
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
      if (user.value) { await loadUserData(user.value.id);
      } else { clearLocalStores() }
      setupAuthListener();
      isInitialized.value = true;
      if (user.value?.id) { console.log(`📡 User initializated: ${user.value?.email}`);
      } else { console.log(`📡 User initializated, but no auth`)}
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
      if (profileError) {
        console.error("Error loading profile:", profileError);
        await signOut();
        return;
      }
      if (!profile) {
        console.error("Profile not found for user:", userId);
        return;
      }
      updateStoresFromProfile(profile);
    } catch (err) {
      console.error("Error loading user data:", err);
      error.value = (err as Error).message;
    }
  };
  // register
  const signUp = async (sign_up_data: new_format, password: string) => {
      isLoading.value = true;
      error.value = null;
      try {
        const { data, error: supabaseError } = await supabase.auth.signUp({ email: sign_up_data.common.email, password: password,options: { data: { username: sign_up_data.common.username }}});
        if (supabaseError) throw supabaseError;
        if (!data.session) { 
          return { success: true, message: "Registration done!" }
        }
        if (data.user) {
          session.value = data.session;
          user.value = data.user;
          const profileData = {...sign_up_data, id: data.user.id, online: true};
          await createUserProfile(profileData);
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
        const userStore = useUserStore();
        userStore.setUserData({...userStore.userData, online: true });
        await saveUserData();
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
    isLoading.value = true; error.value = null;
    try {
      const userStore = useUserStore();
      await userStore.setUserData({...userStore.userData, online: false });
      await saveUserData();
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
      const userData = userStore.getUserData();
      const { error: supabaseError } = await supabase.from("profiles").update({
        online: userData.online,
        friends: userData.friends,
        common: {
          sub_tier: userData.common.sub_tier,
          username: userData.common.username,
          email: userData.common.email,
          icon: userData.common.icon,
        },
        config: {
          first_login: userData.config.first_login,
          lang: userData.config.lang,
          theme: userData.config.theme,
          monochrome: userData.config.monochrome,
        },
        body_data: {
          general: {
            gender: userData.body_data.general.gender,
            age: userData.body_data.general.age,
            height: userData.body_data.general.height,
            activity: userData.body_data.general.activity,
          },
          current: {
            weight: userData.body_data.current.weight,
            bf: userData.body_data.current.bf,
          },
          goal: {
            weight: userData.body_data.goal.weight,
            bf: userData.body_data.goal.bf,
          },
        },
        macros_data: {
          current: {
            kcal: userData.macros_data.current.kcal,
            proteins: userData.macros_data.current.proteins,
            carbs: userData.macros_data.current.carbs,
            fats: userData.macros_data.current.fats,
          },
          goal: {
            kcal: userData.macros_data.goal.kcal,
            proteins: userData.macros_data.goal.proteins,
            carbs: userData.macros_data.goal.carbs,
            fats: userData.macros_data.goal.fats,
          },
        },
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
  const createUserProfile = async (data: new_format) => {
    const randomIcon = getRandomAvatarIndex();
    try {
      const { error } = await supabase.from("profiles").insert({
        id: data.id,
        online: data.online,
        friends: data.friends,
        common: {
          sub_tier: data.common.sub_tier,
          username: data.common.username,
          email: data.common.email,
          icon: randomIcon,
        },
        config: {
          first_login: data.config.first_login,
          lang: data.config.lang,
          theme: data.config.theme,
          monochrome: data.config.monochrome,
        },
        body_data: {
          general: {
            gender: data.body_data.general.gender,
            age: data.body_data.general.age,
            height: data.body_data.general.height,
            activity: data.body_data.general.activity,
          },
          current: {
            weight: data.body_data.current.weight,
            bf: data.body_data.current.bf,
          },
          goal: {
            weight: data.body_data.goal.weight,
            bf: data.body_data.goal.bf,
          },
        },
        macros_data: {
          current: {
            kcal: data.macros_data.current.kcal,
            proteins: data.macros_data.current.proteins,
            carbs: data.macros_data.current.carbs,
            fats: data.macros_data.current.fats,
          },
          goal: {
            kcal: data.macros_data.goal.kcal,
            proteins: data.macros_data.goal.proteins,
            carbs: data.macros_data.goal.carbs,
            fats: data.macros_data.goal.fats,
          },
        },
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
    userStore.setUserData({
      id: profile.id,
      online: true,
      friends: profile.friends || [],
      common: {
        sub_tier: profile.common?.sub_tier || 0,
        username: profile.common?.username || "",
        email: user.value?.email || "",
        icon: profile.common?.icon || 0,
      },
      config: {
        first_login: profile.config?.first_login ?? false,
        lang: profile.config?.lang || "en",
        theme: profile.config?.theme || "light",
        monochrome: profile.config?.monochrome || "mono",
      },
      body_data: profile.body_data || {
        general: { gender: "male", age: 21, height: 180, activity: 1.45 },
        current: { weight: 72, bf: 10 },
        goal: { weight: 82, bf: 8 },
      },
      macros_data: profile.macros_data || {
        current: { kcal: 0, proteins: 0, carbs: 0, fats: 0 },
        goal: { kcal: 0, proteins: 0, carbs: 0, fats: 0 },
      },
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
    userStore.clearUserData();
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
