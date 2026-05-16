export interface tExercise {
  id?: number;
  name?: string;
  tags?: string[];
}
export interface tWorkoutItem {
  id?: number;
  exerciseId?: number;
  weight?: number;
  sets?: number;
  reps?: number;
}
export interface tWorkout {
  id?: number;
  date?: string;
  list?: tWorkoutItem[];
}
