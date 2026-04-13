import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../../appSettings/supabase";
import { useAuthStore } from "../main/useAuthStore";
import type { tAsset } from "../main/types";

export const useAssetStore = defineStore("asset", () => {
  const authStore = useAuthStore();
  const assets = ref<tAsset[]>([]);

  const getAssets = async () => {
    if (!authStore.user) return;
    try {
      const { data, error: supabaseError } = await supabase.from("arrayAsset").select("*").eq("user_id", authStore.user.id).maybeSingle();
      if (supabaseError) throw supabaseError;
      if (data) assets.value = data.assets;
    } catch (err) {
      console.error("Error at 'getAssets': ", err);
    }
  }
  
  const updateAssets = async () => {
    if (!authStore.user) return;
    try {
      const { error: supabaseError } = await supabase.from("arrayAsset").upsert({ user_id: authStore.user.id, assets: assets.value });
      if (supabaseError) throw supabaseError;
    } catch (err) {
      console.error("Error at 'updateAssets': ", err);
    }
  }

  const addAsset = async (data: tAsset) => {
    if (!authStore.user) return;
    if (assets.value.length >= 20) assets.value.shift(); 
    assets.value.push(data);
    await updateAssets();
  }

  const delAsset = async (assetId: string) => {
    if (!authStore.user) return;
    assets.value = assets.value.filter(item => item.id !== assetId);
    await updateAssets();
  };

  const clearAssets = async () => {
    assets.value = [];
  }

  return { assets, getAssets, updateAssets, addAsset, delAsset, clearAssets };
});
