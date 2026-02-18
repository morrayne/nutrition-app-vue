<script setup lang="ts">
// MAIN IMPORTS
// vue
import { ref, onMounted } from "vue";
import { useUserStore } from "../../store/useUserStore";

// PROPS & EMITS
const props = defineProps(["userData"]);
const emit = defineEmits(["update-field", "finish"]);

// STORE
const userStore = useUserStore();

// Рассчитываем макросы при монтировании
onMounted(() => {
  userStore.calculateMacros();
});

// Завершение онбординга
const saveAndFinish = () => {
  console.log("Все данные:", props.userData);
  emit("finish"); // сигнал родителю, что онбординг завершен
};
</script>

<template>
  <div class="finale">
    <h1 class="title"></h1>
    
    <!-- Конфигурация -->
    <div class="section">
      <h2 class="section-title config-title"></h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="label theme-label"></span>
          <span class="value">{{ userData?.theme }}</span>
        </div>
        <div class="info-item">
          <span class="label lang-label"></span>
          <span class="value">{{ userData?.lang === 'en' ? 'English' : 'Русский' }}</span>
        </div>
        <div class="info-item">
          <span class="label mono-label"></span>
          <span class="value">{{ userData?.monochrome === 'mono' ? 'Monochrome' : 'Multi' }}</span>
        </div>
      </div>
    </div>

    <!-- Пользователь -->
    <div class="section">
      <h2 class="section-title user-title"></h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="label username-label"></span>
          <span class="value">{{ userData?.username }}</span>
        </div>
        <div class="info-item">
          <span class="label email-label"></span>
          <span class="value">{{ userData?.email }}</span>
        </div>
      </div>
    </div>

    <!-- Тело -->
    <div class="section">
      <h2 class="section-title body-title"></h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="label gender-label"></span>
          <span class="value">{{ userData?.gender === 'male' ? 'Male' : 'Female' }}</span>
        </div>
        <div class="info-item">
          <span class="label age-label"></span>
          <span class="value">{{ userData?.age }} y.o.</span>
        </div>
        <div class="info-item">
          <span class="label height-label"></span>
          <span class="value">{{ userData?.height }} cm</span>
        </div>
      </div>
    </div>

    <!-- Текущие показатели -->
    <div class="section">
      <h2 class="section-title current-title"></h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="label weight-label"></span>
          <span class="value">{{ userData?.weight }} kg</span>
        </div>
        <div class="info-item">
          <span class="label bf-label"></span>
          <span class="value">{{ userData?.bf }}%</span>
        </div>
        <div class="info-item">
          <span class="label activity-label"></span>
          <span class="value">{{ userData?.activity }}</span>
        </div>
      </div>
    </div>

    <!-- Цели -->
    <div class="section">
      <h2 class="section-title goal-title"></h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="label goal-weight-label"></span>
          <span class="value">{{ userData?.goalWeight }} kg</span>
        </div>
        <div class="info-item">
          <span class="label goal-bf-label"></span>
          <span class="value">{{ userData?.goalBf }}%</span>
        </div>
      </div>
    </div>

    <!-- Макросы (рассчитанные) -->
    <div class="section macros">
      <h2 class="section-title macros-title"></h2>
      <div class="macros-grid">
        <div class="macro-item">
          <span class="macro-label kcal-label"></span>
          <span class="macro-value">{{ userStore.macros.kcal }}</span>
        </div>
        <div class="macro-item">
          <span class="macro-label protein-label"></span>
          <span class="macro-value">{{ userStore.macros.proteins }}g</span>
        </div>
        <div class="macro-item">
          <span class="macro-label carbs-label"></span>
          <span class="macro-value">{{ userStore.macros.carbs }}g</span>
        </div>
        <div class="macro-item">
          <span class="macro-label fats-label"></span>
          <span class="macro-value">{{ userStore.macros.fats }}g</span>
        </div>
      </div>
    </div>

    <button class="finish-btn" @click="saveAndFinish"></button>
  </div>
</template>

<style scoped>
.finale {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  overflow-y: auto;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
}

.title::after {
  content: var(--health-finale);
}

.section {
  background: var(--back-c);
  border-radius: 0.75rem;
  padding: 0.75rem;
  border: solid 0.0625rem var(--back-d);
}

.section-title {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--text-a);
}

.config-title::after { content: var(--config-data); }
.user-title::after { content: var(--general-data); }
.body-title::after { content: var(--body-data); }
.current-title::after { content: var(--current-data); }
.goal-title::after { content: var(--goal-data); }
.macros-title::after { content: "Recommended macros"; }

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.label {
  font-size: 0.65rem;
  color: var(--text-c);
}

.theme-label::after { content: var(--theme); }
.lang-label::after { content: var(--language); }
.mono-label::after { content: var(--monochrome); }
.username-label::after { content: var(--username); }
.email-label::after { content: var(--email); }
.gender-label::after { content: var(--gender); }
.age-label::after { content: var(--age); }
.height-label::after { content: var(--height); }
.weight-label::after { content: var(--weight); }
.bf-label::after { content: var(--bf); }
.activity-label::after { content: var(--activity); }
.goal-weight-label::after { content: var(--goal-weight); }
.goal-bf-label::after { content: var(--goal-bf); }

.value {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-a);
}

.macros-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.macro-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--back-d);
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.macro-label {
  font-size: 0.65rem;
  color: var(--text-c);
  margin-bottom: 0.25rem;
}

.kcal-label::after { content: "Calories"; }
.protein-label::after { content: "Protein"; }
.carbs-label::after { content: "Carbs"; }
.fats-label::after { content: "Fats"; }

.macro-value {
  font-size: 1rem;
  font-weight: bold;
  color: var(--text-a);
}

.finish-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: var(--text-a);
  color: var(--back-a);
  border: none;
  margin-top: 0.5rem;
  font-weight: 500;
}

.finish-btn::after {
  content: var(--finish);
}
</style>
