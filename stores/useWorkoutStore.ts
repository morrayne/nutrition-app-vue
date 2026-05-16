import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../appSettings/supabase";
import { useAuthStore } from "./useAuthStore";
import type { tWorkout, tWorkoutItem } from "../appSettings/export/types/sport";

export const useWorkoutStore = defineStore("workouts", () => {
  const authStore = useAuthStore();
  const workouts = ref<tWorkout[]>([]);

  const getStore = async () => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("workouts").select("*").eq("user_id", authStore.user.id).order("date", { ascending: false });
    if (!error && data) workouts.value = data;
  };

  const addWorkout = async (workout: Omit<tWorkout, "id">) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("workouts").insert({ ...workout, user_id: authStore.user.id }).select().single();
    if (!error && data) workouts.value.unshift(data);
    return data;
  };

  const updateWorkout = async (workout: tWorkout) => {
    if (!authStore.user) return;
    const { data, error } = await supabase.from("workouts").update({ list: workout.list, date: workout.date }).eq("id", workout.id).select().single();
    if (!error && data) {
      const index = workouts.value.findIndex((i) => i.id === workout.id);
      if (index !== -1) workouts.value[index] = data;
    }
    return data;
  };

  const deleteWorkout = async (id: number) => {
    if (!authStore.user) return;
    const { error } = await supabase.from("workouts").delete().eq("id", id);
    if (!error) workouts.value = workouts.value.filter((i) => i.id !== id);
    return !error;
  };

  const addWorkoutItem = async (workoutId: number, item: Omit<tWorkoutItem, "id">) => {
    const workout = workouts.value.find((w) => w.id === workoutId);
    if (!workout) return null;
    const newItem = { ...item, id: Date.now() };
    const updatedList = [...(workout.list || []), newItem];
    return updateWorkout({ ...workout, list: updatedList });
  };

  const updateWorkoutItem = async (workoutId: number, itemId: number, updates: Partial<Omit<tWorkoutItem, "id">>) => {
    const workout = workouts.value.find((w) => w.id === workoutId);
    if (!workout) return null;
    const updatedList = workout.list!.map((item) => (item.id === itemId ? { ...item, ...updates } : item));
    return updateWorkout({ ...workout, list: updatedList });
  };

  const deleteWorkoutItem = async (workoutId: number, itemId: number) => {
    const workout = workouts.value.find((w) => w.id === workoutId);
    if (!workout) return null;

    const updatedList = workout.list!.filter((item) => item.id !== itemId);
    return updateWorkout({ ...workout, list: updatedList });
  };

  return { workouts, getStore, addWorkout, updateWorkout, deleteWorkout, addWorkoutItem, updateWorkoutItem, deleteWorkoutItem };
});
