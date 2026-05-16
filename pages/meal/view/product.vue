<script setup lang="ts">
import { ref } from "vue";

import { X, ArrowLeft } from "@lucide/vue";

const menu = ref<boolean>(false);
const editMode = ref<boolean>(false);

import { getDateLikeId } from "../../../appSettings/export/vars/default";
import type { tProductSaved } from "../../../appSettings/export/types/food";

const editor = ref<tProductSaved>({
  id: undefined,
  name: undefined,
  calories: undefined,
  proteins: undefined,
  carbs: undefined,
  fats: undefined,
});

import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { useProductStore } from "../../../stores/useProductStore";
const productStore = useProductStore();

import vInputString from "../../../components/form/vInputString.vue";
import { mealName } from "../../../appSettings/export/form/vInputString";
import vInputNumber from "../../../components/form/vInputNumber.vue";
import { mealCalories, mealProteins, mealCarbs, mealFats } from "../../../appSettings/export/form/vInputNumber";

import productWrap from "../wrap/product.vue";

const clearEditor = () => {
  editor.value.id = undefined;
  editor.value.name = undefined;
  editor.value.calories = undefined;
  editor.value.proteins = undefined;
  editor.value.fats = undefined;
  editor.value.carbs = undefined;
  editMode.value = false;
};
const handleMain = (data: tProductSaved) => {
  editMode.value = true;
  editor.value.name = data.name;
  editor.value.calories = data.calories;
  editor.value.proteins = data.proteins;
  editor.value.fats = data.fats;
  editor.value.carbs = data.carbs;
  menu.value = true;
};
const handleDelete = async (data: number) => {
  loading.value = true;
  try {
    await productStore.deleteItem(data);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 250);
  }
};
const handleNewProduct = () => {
  menu.value = true;
  editMode.value = false;
};
const finish = async () => {
  loading.value = true;
  // validation and autocorrect
  const e = editor.value;
  if (!e.name && !e.calories) return;
  if (!e.proteins) editor.value.proteins = 0;
  if (!e.fats) editor.value.fats = 0;
  if (!e.carbs) editor.value.carbs = 0;
  // logic
  if (editMode.value) {
    try {
      await productStore.updateItem(editor.value);
    } finally {
      setTimeout(() => {
        loading.value = false;
        clearEditor();
      }, 250);
    }
  } else {
    try {
      await productStore.addItem({ ...editor.value, id: getDateLikeId() });
    } finally {
      setTimeout(() => {
        loading.value = false;
        clearEditor();
      }, 250);
    }
  }
};

import loadingView from "../../../components/wraps/loading.vue";
const loading = ref<boolean>(false);
</script>

<template>
  <loadingView v-if="loading" />
  <div class="w-100 h-100 g-05 pos-a editor-wrap" v-if="menu">
    <div class="flex-c g-05 def-wrap editor">
      <div class="w-100 g-05 a-c double">
        <vInputString :construct="mealName" v-model="editor.name" :disable="editMode" />
        <!-- prettier-ignore -->
        <div class="h-100 def-wrap round" @click="menu = false; clearEditor()">
          <ArrowLeft color="var(--sub-color)" />
        </div>
      </div>
      <div class="g-05 middle">
        <vInputNumber :construct="mealCalories" v-model="editor.calories" />
        <vInputNumber :construct="mealProteins" v-model="editor.proteins" />
        <vInputNumber :construct="mealFats" v-model="editor.fats" />
        <vInputNumber :construct="mealCarbs" v-model="editor.carbs" />
      </div>
      <div class="w-100 g-05 a-c double">
        <p class="w-100 j-c finish def-wrap" @click="finish">{{ t("finish") }}</p>
        <div class="h-100 def-wrap round" @click="clearEditor"><X color="var(--sub-color)" /></div>
      </div>
    </div>
  </div>
  <p class="w-100 j-c bounce new-asset" @click="handleNewProduct">{{ t("add") }}</p>
  <div class="w-100 g-05 half">
    <productWrap v-for="(item, index) in productStore.products" :construct="productStore.products[productStore.products.length - index - 1]!" @main="handleMain" @delete="handleDelete" />
  </div>
</template>

<style scoped lang="scss">
.half {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
@media (max-width: 768px) {
  .half {
    grid-template-columns: repeat(1, 1fr);
  }
}

.new-asset {
  padding: 1rem 0;
  border-radius: 1rem;
  border: dashed 2px var(--ex-color);
  color: var(--ex-color);
}
.editor-wrap {
  align-items: end;
  position: absolute;
  z-index: 10;
  .editor {
    backdrop-filter: blur(0.5rem);
    padding: 1rem;
    border-radius: 2rem;
    overflow: hidden;
    .middle {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }
    .double {
      .def-wrap {
        padding: 1rem;
      }
      .finish {
        padding: 0.9rem 1rem;
      }
      .round {
        width: fit-content;
        aspect-ratio: 1 / 1;
        padding: 0.75rem;
        border-radius: 4rem;
        svg {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
  }
}
</style>
