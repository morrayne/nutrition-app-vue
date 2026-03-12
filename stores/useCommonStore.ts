// MAIN IMPORTS
// vue & pinia
import { ref, computed } from "vue";
import { defineStore } from "pinia";
// supabase
import { supabase } from "../app_settings/supabase";
import { useAuthStore } from "./useAuthStore";

// TYPES
export interface common_type {
  user_id: string;
  online: boolean;
  icon: number | null;
  email: string | null;
  username: string | null;
  sub_tier: number | null;
  first_login: boolean | null;
}

// STORE
export const useCommonStore = defineStore("common", () => {
  // STATE
  const authStore = useAuthStore();
  const availableAvatars = ref<string[]>([]);
  const avatarsLoading = ref(false);
  const isSubscribed = computed(() => profile.value.sub_tier === 1);
  const userEmail = computed(() => profile.value.email);
  const username = computed(() => profile.value.username);
  const userId = computed(() => profile.value.user_id);
  const profile = ref<common_type>({
    user_id: "",
    online: false,
    icon: null,
    email: null,
    username: null,
    sub_tier: null,
    first_login: null,
  });

  // ACTION
  const loadProfile = async () => {
    if (!authStore.user) return;
    try {
      const { data, error } = await supabase.from("common").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (error) throw error;
      if (data) setProfile(data);
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };
  // 
  const setProfile = (data: Partial<common_type>) => {
    profile.value = { ...profile.value, ...data };
  };
  // 
  const updateProfile = async (data: Partial<common_type>) => {
    if (!authStore.user) return;
    try {
      const { error } = await supabase.from("common").update(data).eq("user_id", authStore.user.id);
      if (error) throw error;
      setProfile(data);
      return { success: true };
    } catch (err) {
      console.error("Error updating profile:", err);
      return { success: false, error: err };
    }
  };
  // 
  const setOnline = async (status: boolean) => {
    profile.value.online = status;
    await updateProfile({ online: status });
  };
  const setIcon = async (icon: number) => {
    profile.value.icon = icon;
    await updateProfile({ icon });
  };
  const setUsername = async (username: string) => {
    profile.value.username = username;
    await updateProfile({ username });
  };
  const setSubTier = async (tier: number) => {
    profile.value.sub_tier = tier;
    await updateProfile({ sub_tier: tier });
  };
  const setFirstLogin = async (value: boolean) => {
    profile.value.first_login = value;
    await updateProfile({ first_login: value });
  };
  // 
  const loadAvailableAvatars = async () => {
    avatarsLoading.value = true;
    try {
      const { data, error } = await supabase.storage.from("icons").list();
      if (error) throw error;
      availableAvatars.value = data.map((file) => supabase.storage.from("icons").getPublicUrl(file.name).data.publicUrl);
    } catch (error) {
      console.error("Error loading avatars:", error);
      availableAvatars.value = [];
    } finally {
      avatarsLoading.value = false;
    }
  };
  // 
  const getAvatarUrl = computed(() => {
    if (availableAvatars.value.length === 0) return "";
    return availableAvatars.value[profile.value.icon || 0] || "";
  });
  // 
  const clearProfile = () => {
    profile.value = {
      user_id: "",
      online: false,
      icon: null,
      email: null,
      username: null,
      sub_tier: null,
      first_login: null,
    };
  };

  // EXPORT
  return { profile, availableAvatars, avatarsLoading, isSubscribed, userEmail, username, userId, getAvatarUrl, loadProfile, setProfile, updateProfile, setOnline, setIcon, setUsername, setSubTier, setFirstLogin, loadAvailableAvatars, clearProfile };
});
