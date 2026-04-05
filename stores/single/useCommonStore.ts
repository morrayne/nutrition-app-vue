import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../../appSettings/supabase";
import { useAuthStore } from "../main/useAuthStore";
import type { tCommon } from "../main/types";

export const useCommonStore = defineStore("common", () => {
  const authStore = useAuthStore();
  const common = ref<tCommon>({
    username: "",
    email: "",
    online: false,
    icon: 1,
  });

  const getCommon = async () => {
    if (!authStore.user) return;
    try {
      const { data, error } = await supabase.from("common").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (error) throw error;
      if (data) setCommon(data);
    } catch (err) {
      console.error("Error at 'getCommon': ", err);
    }
  };

  const updateCommon = async () => {
    if (!authStore.user) return;
    try {
      const { error: supabaseError } = await supabase.from("common").upsert({ 
        user_id: authStore.user.id, 
        email: common.value.email,
        username: common.value.username,
        icon: common.value.icon,
        online: common.value.online
      });
      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error("Error at 'updateCommon': ", err);
    }
  };

  const setCommon = (data: tCommon) => {
    common.value = data;
  };

  const clearCommon = () => {
    common.value = {
      username: "",
      email: "",
      online: false,
      icon: 1,
    };
  };

  return { common, getCommon, updateCommon, setCommon, clearCommon };
});
