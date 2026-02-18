// MAIN IMPORTS
// vue & pinia
import { ref, computed } from "vue";
import { defineStore } from "pinia";
// types & supabase
import { supabase } from "../utils/supabase";
import type { username_icon_type, user_body_type, macros_type, sub_type, body_measurements_type, body_goal_type} from './store_types';

// MAIN EXPORT
// store
export const useUserStore = defineStore("user", () => {
  // STATE
  // username and icon id
  const common = ref<username_icon_type>({
    username: "",
    icon: 0,
    firstLogin: false,
  });
  // sub tier
  const subscription = ref<sub_type>({
    tier: 0,
  });
  // gender, current body measurements and goals
  const body = ref<user_body_type>({
    gender: "male",
    current: {
      age: 21,
      height: 180,
      activity: 1.45,
      weight: 72,
      bf: 10,
    },
    goal: {
      weight: 82,
      bf: 8,
    },
  });
  // icons fetching
  const availableAvatars = ref<string[]>([]);
  const avatarsLoading = ref(false);
  // macros
  const macros = ref<macros_type>({
    kcal: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
  });
  
  // ACTIONS
  // common
  const updateCommon = (data: Partial<username_icon_type>) => {
    Object.assign(common.value, data);
  };
  // sub
  const updateSubscription = (tier: 0 | 1) => {
    subscription.value.tier = tier;
  };
  // body current
  const updateBodyCurrent = (data: Partial<body_measurements_type>) => {
    Object.assign(body.value.current, data);
  };
  // body goal
  const updateBodyGoal = (data: Partial<body_goal_type>) => {
    Object.assign(body.value.goal, data);
  };
  // body gender 
  const updateGender = (gender: "male" | "female") => {
    body.value.gender = gender;
  };

  // HARD LOGIC
  // icons loading from bucket
  const loadAvailableAvatars = async () => {
    avatarsLoading.value = true;
    try {
      const { data, error } = await supabase.storage.from("icons").list();
      console.log("📦 Icons loaded:", data?.length);
      if (error) throw error;
      availableAvatars.value = data.map(file => supabase.storage.from("icons").getPublicUrl(file.name).data.publicUrl);
      // console.log(`Loaded ${availableAvatars.value.length} avatars`);
    } catch (error) {
      console.error("Error loading avatars:", error);
      availableAvatars.value = [];
    } finally {
      avatarsLoading.value = false;
    }
  };
  // macros calculation to maintain
  const calculateMacrosFromCurrent = () => {
    const { current, gender } = body.value;
    let bmr = 0;
    if (gender === "male") { bmr = 10 * (current.weight || 70) + 6.25 * current.height - 5 * current.age + 5
    } else { bmr = 10 * (current.weight || 60) + 6.25 * current.height - 5 * current.age - 161 }
    const tdee = bmr * current.activity;
    const proteinPerKg = 1.5;
    const fatPercentage = 0.25;
    const proteinCalories = current.weight * proteinPerKg * 4;
    const fatCalories = tdee * fatPercentage;
    const carbCalories = tdee - proteinCalories - fatCalories;
    return { kcal: Math.round(tdee), proteins: Math.round(current.weight * proteinPerKg), carbs: Math.round(carbCalories / 4), fats: Math.round(fatCalories / 9) };
  };
  // macros calculation to get to goals
  const calculateMacrosFromGoal = () => {
    const { goal, gender } = body.value;
    const currentActivity = body.value.current.activity;
    let bmr = 0;
    if (gender === "male") { bmr = 10 * goal.weight + 6.25 * body.value.current.height - 5 * body.value.current.age + 5
    } else { bmr = 10 * goal.weight + 6.25 * body.value.current.height - 5 * body.value.current.age - 161 }
    const tdee = bmr * currentActivity;
    const proteinPerKg = 1.5;
    const fatPercentage = 0.25;
    const proteinCalories = goal.weight * proteinPerKg * 4;
    const fatCalories = tdee * fatPercentage;
    const carbCalories = tdee - proteinCalories - fatCalories;
    return { kcal: Math.round(tdee), proteins: Math.round(goal.weight * proteinPerKg), carbs: Math.round(carbCalories / 4), fats: Math.round(fatCalories / 9) };
  };
  // simplifier
  const calculateMacros = (type: "current" | "goal" = "current") => {
    if (type === "goal") {
      const goalMacros = calculateMacrosFromGoal();
      macros.value = goalMacros;
    } else {
      const currentMacros = calculateMacrosFromCurrent();
      macros.value = currentMacros;
    }
  };

  // USER DATA ACTIONS
  // get
  const getUserData = () => ({
    common: common.value,
    subscription: subscription.value,
    body: body.value,
    macros: macros.value,
  });
  // set
  const setUserData = (userData: {
    common: username_icon_type;
    subscription: sub_type;
    body: user_body_type;
    macros: macros_type;
  }) => {
    updateCommon(userData.common);
    updateSubscription(userData.subscription.tier);
    updateBodyCurrent(userData.body.current);
    updateBodyGoal(userData.body.goal);
    updateGender(userData.body.gender);
    macros.value = userData.macros;
  };
  // hard reset
  const clearUserData = () => {
    common.value = { username: "", icon: 0, firstLogin: false };
    subscription.value = { tier: 0 };
    body.value = {
      gender: "male",
      current: {
        age: 21,
        height: 180,
        activity: 1.45,
        weight: 72,
        bf: 10,
      },
      goal: { weight: 82, bf: 8 },
    };
    macros.value = { kcal: 0, proteins: 0, carbs: 0, fats: 0 };
  };

  // EXPORTS
  return {
    // State
    common, subscription, body, macros, availableAvatars, avatarsLoading,
    // Actions
    updateCommon, updateSubscription, updateBodyCurrent, updateBodyGoal, updateGender, calculateMacros, getUserData, setUserData, clearUserData, loadAvailableAvatars
  };
})
