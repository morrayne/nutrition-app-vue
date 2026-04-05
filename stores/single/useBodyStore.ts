import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../../appSettings/supabase";
import { useAuthStore } from "../main/useAuthStore";
import type { tBody } from "../main/types";

export const useBodyStore = defineStore("body", () => {
  const authStore = useAuthStore();
  const body = ref<tBody>({
    gender: "male",
    age: 21,
    height: 180,
    activity: 1.2,
    weight: 72,
    bf: 12,
  });

  const getBody = async () => {
    if (!authStore.user) return;
    try {
      const { data, error: supabaseError } = await supabase.from("body").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (supabaseError) throw supabaseError;
      if (data) body.value = data;
    } catch (err) {
      console.error("Error at 'getBody': ", err);
    }
  }

  const updateBody = async () => {
    if (!authStore.user) return;
    try {
      const { error: supabaseError } = await supabase.from("body").upsert({ 
        user_id: authStore.user.id, 
        gender: body.value.gender,
        age: body.value.age,
        height: body.value.height,
        activity: body.value.activity,
        weight: body.value.weight,
        bf: body.value.bf
      });
      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error("Error at 'updateBody': ", err);
    }
  };

  const setBody = async (data: tBody) => {
    body.value = data;
    await updateBody();
  }

  const clearBody = async () => {
    body.value = {
      gender: "male",
      age: 21,
      height: 180,
      activity: 1.2,
      weight: 72,
      bf: 12,
    };
  }

  return { body, getBody, updateBody, setBody, clearBody }
});
