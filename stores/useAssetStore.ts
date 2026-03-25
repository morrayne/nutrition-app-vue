import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../appSettings/supabase";
export interface tAsset {
  id: string;
  product_name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}
export const useAssetStore = defineStore("asset", () => {
  const assets = ref<tAsset[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const fetchAssets = async (userId: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data, error: supabaseError } = await supabase.from("assets").select("products").eq("user_id", userId).maybeSingle();
      if (supabaseError) throw supabaseError;
      assets.value = data?.products || [];
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error fetching assets:", err);
    } finally {
      isLoading.value = false;
    }
  };
  const addAsset = async (userId: string, asset: Omit<tAsset, "id" | "created_at">) => {
    isLoading.value = true;
    error.value = null;
    try {
      const newAsset: tAsset = { ...asset, id: crypto.randomUUID() };
      const newAssets = [...assets.value, newAsset];
      const { error: supabaseError } = await supabase.from("assets").upsert({ user_id: userId, products: newAssets }, { onConflict: "user_id" });
      if (supabaseError) throw supabaseError;
      assets.value = newAssets;
      return { success: true, asset: newAsset };
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error adding asset:", err);
      return { success: false, error: err };
    } finally {
      isLoading.value = false;
    }
  };
  const deleteAsset = async (userId: string, assetId: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const newAssets = assets.value.filter((a) => a.id !== assetId);
      const { error: supabaseError } = await supabase.from("assets").upsert({ user_id: userId, products: newAssets }, { onConflict: "user_id" });
      if (supabaseError) throw supabaseError;
      assets.value = newAssets;
      return { success: true };
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error deleting asset:", err);
      return { success: false, error: err };
    } finally {
      isLoading.value = false;
    }
  };
  return { assets, isLoading, error, fetchAssets, addAsset, deleteAsset };
});
