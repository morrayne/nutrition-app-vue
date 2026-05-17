import { ref, computed } from "vue";

import { defineStore } from "pinia";
import router from "../appSettings/router";

import { supabase } from "../appSettings/supabase";
import { getRandomAvatarIndex, today } from "../appSettings/export/vars/default";

import type { AuthError, Session, User } from "@supabase/supabase-js";
import type { tCommonTable, tBodyTable, tSignTable } from "../appSettings/export/types/store";

// body & aommon & weighlog
import { useBodyStore } from "../stores/useBodyStore";
import { useCommonStore } from "../stores/useCommonStore";
import { useWeightLogStore } from "../stores/useWeightLogStore";
// food
import { useProductStore } from "../stores/useProductStore";
import { useMealStore } from "../stores/useMealStore";
import { useFoodHistoryStore } from "../stores/useFoodHistoryStore";
// sport
import { useExerciseStore } from "../stores/useExerciseStore";
import { useWorkoutStore } from "../stores/useWorkoutStore";
// meds
import { useMedicineStore } from "../stores/useMedicineStore";

export const useAuthStore = defineStore("auth", () => {
  // body & aommon & weighlog
  const bodyStore = useBodyStore();
  const commonStore = useCommonStore();
  const weightLogStore = useWeightLogStore();
  // food
  const productStore = useProductStore();
  const mealStore = useMealStore();
  const foodHistoryStore = useFoodHistoryStore();
  // sport
  const exerciseStore = useExerciseStore();
  const workoutStore = useWorkoutStore();
  // meds
  const medicineStore = useMedicineStore();
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
    weightLogStore.clearStore();
  };
  // Загрузка всех данных пользователя
  const loadUserData = async () => {
    if (!userId.value) return;
    try {
      await Promise.all([commonStore.getStore(), bodyStore.getStore(), weightLogStore.getStore(), productStore.getStore(), mealStore.getStore(), foodHistoryStore.getStore(), exerciseStore.getStore(), workoutStore.getStore(), medicineStore.getStore()]);
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
  const createUserProfile = async (common: tCommonTable, body: tBodyTable) => {
    if (!userId.value) return;
    try {
      // Устанавливаем данные в сторы
      commonStore.setStore({ ...common, icon: getRandomAvatarIndex() });
      bodyStore.setStore(body);
      // Добавляем начальную запись веса
      if (body.weightNow) await weightLogStore.addEntry({ date: today, weight: body.weightNow, bodyFat: body.bodyFatNow! });
      // Сохраняем все в БД
      await Promise.all([commonStore.updateStore(), bodyStore.updateStore()]);
    } catch (err) {
      console.error("Error at 'createUserProfile': ", err);
      throw err;
    }
  };
  // Регистрация
  const signUp = async (auth: tSignTable, common: tCommonTable, body: tBodyTable) => {
    error.value = null;
    try {
      const { data, error: supabaseError } = await supabase.auth.signUp({ email: auth.email!, password: auth.password! });
      if (supabaseError) throw supabaseError;
      if (data.user) {
        user.value = data.user;
        session.value = data.session;
        // Ждём создания профиля
        await createUserProfile(common, body);
        // Небольшая задержка для синхронизации с БД
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Загружаем данные
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
        // Небольшая задержка для синхронизации
        await new Promise((resolve) => setTimeout(resolve, 300));
        await loadUserData();
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
      commonStore.setStore(commonStore.common);
      await commonStore.updateStore();
      const { error: supabaseError } = await supabase.auth.signOut();
      if (supabaseError) throw supabaseError;
      else {
        clearAllStores();
        user.value = null;
        session.value = null;
        router.push("/signup");
        return { success: true };
      }
    } catch (err) {
      error.value = (err as AuthError).message;
      return { success: false, error: err };
    }
  };

  return { user, session, error, isInitialized, isAuthenticated, userId, userEmail, initialize, signUp, signIn, signOut, loadUserData, clearAllStores };
});
