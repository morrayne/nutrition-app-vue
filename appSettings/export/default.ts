export const today = new Date().toISOString().split("T")[0];

export const getRandomAvatarIndex = () => {
  return Math.floor(Math.random() * 27);
};

export const getDateLikeId = () => {
  const now = new Date();
  let id = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}${String(now.getMilliseconds()).padStart(3, '0')}`;
  return Number(id);
}

export const calculateMacros = (age: number, height: number, activity: number, gender: "male" | "female", weightCurrent: number, bodyFatCurrent: number, weightGoal: number, bodyFatGoal: number) => {
  // 1. Расчет текущей и целевой безжировой массы
  const leanMassGoal = weightGoal * (1 - bodyFatGoal / 100);
  // 2. Расчет BMR по формуле Миффлина-Сан Жеора
  let bmr: number;
  if (gender === "male") bmr = 10 * weightCurrent + 6.25 * height - 5 * age + 5;
  else bmr = 10 * weightCurrent + 6.25 * height - 5 * age - 161;
  // 3. Расчет BMR по формуле Кэтча-МакАрдла (через безжировую массу)
  const bmrKatch = 370 + 21.6 * leanMassGoal;
  // 4. Средний BMR
  const avgBmr = (bmr + bmrKatch) / 2;
  let tdee = avgBmr * activity;
  // 5. Коррекция калорий в зависимости от цели
  const weightDiff = weightGoal - weightCurrent;
  let calorieAdjustment = 0;
  // Набор массы: профицит 10-15%
  if (weightDiff > 0) calorieAdjustment = tdee * 0.1;
  // Похудение: дефицит 15-20%
  else calorieAdjustment = tdee * -0.15;
  const targetCalories = tdee + calorieAdjustment;
  // 6. Расчёт белков (на основе целевой безжировой массы) 2.0-2.4 г на кг сухой массы (выше при похудении, ниже при наборе)
  let proteinMultiplier;
  if (weightDiff < 0 || bodyFatGoal < 15) proteinMultiplier = 2.2; // похудение — больше белка
  else proteinMultiplier = 1.8; // набор — можно чуть меньше
  const proteins = Math.round(leanMassGoal * proteinMultiplier);
  // 7. Расчёт жиров (на основе текущего веса) 0.8-1.0 г на кг веса, минимум 45 г для гормонального фона
  let fats = Math.round(weightCurrent * 0.85);
  if (bodyFatCurrent < 15) fats = Math.round(weightCurrent * 0.95);
  if (bodyFatCurrent > 25) fats = Math.round(weightCurrent * 0.75);
  fats = Math.max(fats, 45); // минимум для здоровья
  // 8. Расчёт углеводов (оставшиеся калории)
  const caloriesFromProteins = proteins * 4;
  const caloriesFromFats = fats * 9;
  let carbs = Math.round((targetCalories - caloriesFromProteins - caloriesFromFats) / 4);
  // 9. Минимальные значения углеводов
  carbs = Math.max(carbs, 80); // для мозга и энергии
  return { calories: Math.round(targetCalories), proteins: Math.round(proteins), fats: Math.round(fats), carbs: Math.round(carbs) };
};
