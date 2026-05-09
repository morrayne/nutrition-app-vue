<script setup lang="ts">
import { useCommonStore } from "../../stores/useCommonStore";
const commonStore = useCommonStore();

import { supabase } from "../../appSettings/supabase";
const getImageUrl = () => {
  let iconIndex: string | number = commonStore.common.icon;
  if (iconIndex < 10) iconIndex = String("0" + iconIndex);
  iconIndex = iconIndex + ".jpg";
  const { data } = supabase.storage.from("icons").getPublicUrl(iconIndex);
  return data.publicUrl;
};
</script>

<template>
  <div class="w-100 h-100 max-w-1080 flex-c pos-r g-1">
    <div class="w-100 def-wrap g-1 mini">
      <div class="h-100 left">
        <img :src="getImageUrl()" alt="" />
      </div>
      <div class="h-100 flex-c j-b bot">
        <p class="fs-l fw-3 t">{{ commonStore.common.email }}</p>
        <p class="fs-m fw-3 b">{{ commonStore.common.username }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mini {
  max-height: 5rem;
  padding: 0.5rem;
  border-radius: 4rem;
  .left {
    aspect-ratio: 1 / 1;
    img {
      width: 100%;
      height: 100%;
      border-radius: 3rem;
    }
  }
  .bot {
    padding: 0.25rem 0;
    .b {
      color: var(--ex-color);
    }
  }
}
</style>
