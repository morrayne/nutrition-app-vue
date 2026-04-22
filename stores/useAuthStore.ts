import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "../appSettings/supabase";
import type { AuthError, Session, User } from "@supabase/supabase-js";
import { getRandomAvatarIndex, today } from "../appSettings/defaultExport";
// types
import type { tCommon, tConfig, tBody, tGoal, tAuth } from "../appSettings/types";
// stores
import { useBodyStore } from "./useBodyStore";
import { useCommonStore } from "./useCommonStore";
import { useConfigStore } from "./useConfigStore";
import { useGoalStore } from "./useGoalStore";
import { useWeightLogStore } from "./useWeightLogStore";

export const useAuthStore = defineStore("auth", () => {
  // Инициализация сторов
  const bodyStore = useBodyStore();
  const commonStore = useCommonStore();
  const configStore = useConfigStore();
  const goalStore = useGoalStore();
  const weightLogStore = useWeightLogStore();
  // Состояние
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const error = ref<string | null>(null);
  const isInitialized = ref(false);
  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const userId = computed(() => user.value?.id);
  const userEmail = computed(() => user.value?.email);
  // Очистка всех сторов
  const clearAllStores = () => {
    bodyStore.clearStore();
    commonStore.clearStore();
    configStore.clearStore();
    goalStore.clearStore();
    weightLogStore.clearStore();
  };
  // Загрузка всех данных пользователя
  const loadUserData = async () => {
    if (!userId.value) return;
    try {
      await Promise.all([
        bodyStore.getStore(),
        commonStore.getStore(),
        configStore.getStore(),
        goalStore.getStore(),
        weightLogStore.getStore(),
      ]);
    } catch (err) {
      console.error("Error at 'loadUserData': ", err);
    }
  };
  // Инициализация
  const initialize = async () => {
    if (isInitialized.value) return;
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      session.value = currentSession;
      user.value = currentSession?.user ?? null;
      if (user.value) await loadUserData();
      else clearAllStores();
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        session.value = newSession;
        user.value = newSession?.user ?? null;
        if (newSession?.user) await loadUserData();
        else clearAllStores();
      });
      isInitialized.value = true;
    } catch (err) {
      console.error("Error at 'initialize': ", err);
      error.value = (err as Error).message;
      clearAllStores();
    }
  };
  // Создание профиля пользователя
  const createUserProfile = async (common: tCommon, config: tConfig, body: tBody, goal: tGoal) => {
    if (!userId.value) return;
    try {
      // Устанавливаем данные в сторы
      commonStore.setStore({ ...common, icon: getRandomAvatarIndex() });
      configStore.setStore(config);
      bodyStore.setStore(body);
      goalStore.setStore(goal);
      // Добавляем начальную запись веса
      if (body.weight) await weightLogStore.addEntry({ date: today, weight: body.weight, bodyFat: body.bodyFat });
      // Сохраняем все в БД
      await Promise.all([commonStore.updateStore(),configStore.updateStore(),bodyStore.updateStore(),goalStore.updateStore()]);
    } catch (err) {
      console.error("Error at 'createUserProfile': ", err);
      throw err;
    }
  };
  // Регистрация
  const signUp = async (auth: tAuth, common: tCommon, config: tConfig, body: tBody, goal: tGoal) => {
    error.value = null;
    try {
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email: auth.email!,
        password: auth.password!,
        options: { data: { username: common.username } }
      });
      if (supabaseError) throw supabaseError;
      if (!data.session) return { success: true };
      if (data.user) {
        user.value = data.user;
        session.value = data.session;
        await createUserProfile(common, config, body, goal);
        await loadUserData();
      }
      return { success: true, data };
    } catch (err) {
      error.value = (err as AuthError).message;
      return { success: false, error: err };
    }
  };
  // Вход
  const signIn = async (email: string, password: string) => {
    error.value = null;
    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({ email, password });
      if (supabaseError) throw supabaseError;
      user.value = data.user;
      session.value = data.session;
      if (data.user) {
        await loadUserData();
        commonStore.setStore({ ...commonStore.common });
        await commonStore.updateStore();
      }
      return { success: true, data };
    } catch (err) {
      error.value = (err as AuthError).message;
      return { success: false, error: err };
    }
  };
  // Выход
  const signOut = async () => {
    error.value = null;
    try {
      commonStore.setStore({ ...commonStore.common });
      await commonStore.updateStore();
      const { error: supabaseError } = await supabase.auth.signOut();
      if (supabaseError) throw supabaseError;
      clearAllStores();
      user.value = null;
      session.value = null;
      return { success: true };
    } catch (err) {
      error.value = (err as AuthError).message;
      return { success: false, error: err };
    }
  };

  return { user, session, error, isInitialized, isAuthenticated, userId, userEmail, initialize, signUp, signIn, signOut, loadUserData, clearAllStores };
});
