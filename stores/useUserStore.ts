// MAIN IMPORTS
// vue & pinia
import { ref, computed } from "vue";
import { defineStore } from "pinia";
// types & supabase
import { supabase } from "../app_settings/supabase";
import type { new_format, common_type, config_type, body_data_type, macros_data_type, body_general_type, body_weight_bf_type } from './store_types';

// STORE
export const useUserStore = defineStore("user", () => {
  // state
  const userData = ref<new_format>({
    id: "",
    online: false,
    friends: [],
    common: {
      sub_tier: 0,
      username: "",
      email: "",
      icon: 0,
    },
    config: {
      first_login: false,
      lang: "en",
      theme: "light",
      monochrome: "mono",
    },
    body_data: {
      general: {
        gender: "male",
        age: 21,
        height: 180,
        activity: 1.45,
      },
      current: {
        weight: 72,
        bf: 10,
      },
      goal: {
        weight: 82,
        bf: 8,
      },
    },
    macros_data: {
      current: {
        kcal: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
      },
      goal: {
        kcal: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
      },
    },
  });
  // icons
  const availableAvatars = ref<string[]>([]);
  const avatarsLoading = ref(false);

  // ACTIONS
  // common
  const updateCommon = (data: Partial<common_type>) => { Object.assign(userData.value.common, data) };
  const setEmail = (email: string) => { userData.value.common.email = email };
  const setUsername = (username: string) => { userData.value.common.username = username };
  const setIcon = (icon: number) => { userData.value.common.icon = icon };
  const setSubscriptionTier = (tier: 0 | 1) => { userData.value.common.sub_tier = tier };
  // config
  const updateConfig = (data: Partial<config_type>) => { Object.assign(userData.value.config, data) };
  const setFirstLogin = (value: boolean) => { userData.value.config.first_login = value };
  const setLang = (lang: "ru" | "en") => { userData.value.config.lang = lang };
  const setTheme = (theme: "light" | "dark") => { userData.value.config.theme = theme };
  const setMonochrome = (mode: "mono" | "multi") => { userData.value.config.monochrome = mode };
  // body
  const updateBodyGeneral = (data: Partial<body_general_type>) => { Object.assign(userData.value.body_data.general, data) };
  const setGender = (gender: "male" | "female") => { userData.value.body_data.general.gender = gender };
  const setAge = (age: number) => { userData.value.body_data.general.age = age };
  const setHeight = (height: number) => { userData.value.body_data.general.height = height };
  const setActivity = (activity: 1.15 | 1.3 | 1.45 | 1.6 | 1.75 | 1.9) => { userData.value.body_data.general.activity = activity };
  const updateBodyCurrent = (data: Partial<body_weight_bf_type>) => { Object.assign(userData.value.body_data.current, data) };
  const updateBodyGoal = (data: Partial<body_weight_bf_type>) => { Object.assign(userData.value.body_data.goal, data) };
  // friends
  const addFriend = (friendId: string) => { 
    if (!userData.value.friends.includes(friendId)) { 
      userData.value.friends.push(friendId);
    }
  };
  const removeFriend = (friendId: string) => { 
    const index = userData.value.friends.indexOf(friendId); 
    if (index > -1) { 
      userData.value.friends.splice(index, 1);
    }
  };
  const hasFriend = (friendId: string): boolean => { 
    return userData.value.friends.includes(friendId);
  };

  // HARD LOGIC
  // icons from bucket
  const loadAvailableAvatars = async () => {
    avatarsLoading.value = true;
    try {
      const { data, error } = await supabase.storage.from("icons").list();
      if (error) throw error;
      availableAvatars.value = data.map(file => supabase.storage.from("icons").getPublicUrl(file.name).data.publicUrl);
    } catch (error) {
      console.error("Error loading avatars:", error);
      availableAvatars.value = [];
    } finally {
      avatarsLoading.value = false;
    }
  };
  // macros
  const calculateCurrentMacros = () => {
    const { general, current } = userData.value.body_data;
    let bmr = 0;
    if (general.gender === "male") {
      bmr = 10 * current.weight + 6.25 * general.height - 5 * general.age + 5;
    } else {
      bmr = 10 * current.weight + 6.25 * general.height - 5 * general.age - 161;
    }
    const tdee = bmr * general.activity;
    const proteinPerKg = 1.5;
    const fatPercentage = 0.25;
    const proteinCalories = current.weight * proteinPerKg * 4;
    const fatCalories = tdee * fatPercentage;
    const carbCalories = tdee - proteinCalories - fatCalories;
    userData.value.macros_data.current = {
      kcal: Math.round(tdee),
      proteins: Math.round(current.weight * proteinPerKg),
      carbs: Math.round(carbCalories / 4),
      fats: Math.round(fatCalories / 9),
    };
  };
  // macros calculations
  const calculateGoalMacros = () => {
    const { general, goal } = userData.value.body_data;
    let bmr = 0;
    if (general.gender === "male") {
      bmr = 10 * goal.weight + 6.25 * general.height - 5 * general.age + 5;
    } else {
      bmr = 10 * goal.weight + 6.25 * general.height - 5 * general.age - 161;
    }
    const tdee = bmr * general.activity;
    const proteinPerKg = 1.5;
    const fatPercentage = 0.25;
    const proteinCalories = goal.weight * proteinPerKg * 4;
    const fatCalories = tdee * fatPercentage;
    const carbCalories = tdee - proteinCalories - fatCalories;
    userData.value.macros_data.goal = {
      kcal: Math.round(tdee),
      proteins: Math.round(goal.weight * proteinPerKg),
      carbs: Math.round(carbCalories / 4),
      fats: Math.round(fatCalories / 9),
    };
  };
  // universal calc
  const calculateMacros = (type: "current" | "goal" = "current") => { if (type === "goal") { calculateGoalMacros() } else { calculateCurrentMacros() }};

  // USER DATA ACTIONS
  const getUserData = () => ({ ...userData.value });
  const setUserData = (data: new_format) => { userData.value = { ...data } };
  const clearUserData = () => {
    userData.value = {
      id: "",
      online: false,
      friends: [],
      common: {
        sub_tier: 0,
        username: "",
        email: "",
        icon: 0,
      },
      config: {
        first_login: false,
        lang: "en",
        theme: "light",
        monochrome: "mono",
      },
      body_data: {
        general: {
          gender: "male",
          age: 21,
          height: 180,
          activity: 1.45,
        },
        current: {
          weight: 72,
          bf: 10,
        },
        goal: {
          weight: 82,
          bf: 8,
        },
      },
      macros_data: {
        current: {
          kcal: 0,
          proteins: 0,
          carbs: 0,
          fats: 0,
        },
        goal: {
          kcal: 0,
          proteins: 0,
          carbs: 0,
          fats: 0,
        },
      },
    };
  };

  // EXPORTS
  return {
    // state
    userData, availableAvatars, avatarsLoading,
    // common actions
    updateCommon, setEmail, setUsername, setIcon, setSubscriptionTier,
    // config actions
    updateConfig, setFirstLogin, setLang, setTheme, setMonochrome,
    // body actions
    updateBodyGeneral, setGender, setAge, setHeight, setActivity, updateBodyCurrent, updateBodyGoal,
    // friends actions
    addFriend, removeFriend, hasFriend,
    // logic
    loadAvailableAvatars, calculateMacros,
    // user data
    getUserData, setUserData, clearUserData,
  };
});
