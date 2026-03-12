<script setup lang="ts">
// MAIN IMPORTS
// vue & store
import { computed, watch } from "vue";
import { useCommonStore } from "../../stores/useCommonStore";
import { useAuthStore } from "../../stores/useAuthStore";
const commonStore = useCommonStore();
const authStore = useAuthStore();

// CONTENT
// props
const props = defineProps<{
  data: boolean;
}>();
// icon url
const avatarUrl = computed(() => {
  if (commonStore.availableAvatars?.length === 0) return "";
  const index = commonStore.profile?.icon || 0;
  return commonStore.availableAvatars?.[index] || "";
});
// vars
const userEmail = computed(() => commonStore.profile?.email || "");
const username = computed(() => commonStore.profile?.username || "");
const userId = computed(() => commonStore.profile?.user_id || "");
const themeClass = computed(() => (props.data ? "dark" : "light"));

watch(() => commonStore.profile, (newProfile) => {}, { deep: true });
</script>

<template>
  <div class="mini-profile" :class="themeClass">
    <div class="img-holder">
      <img v-if="authStore.isAuthenticated && avatarUrl" :src="avatarUrl" alt="profile icon" class="icon" />
      <div v-else class="box"></div>
    </div>
    <div class="text-w">
      <div class="username" v-if="authStore.isAuthenticated"> {{ username }} </div>
      <div class="fake-username" v-else></div>
      <div class="email" v-if="authStore.isAuthenticated"> {{ userEmail }} </div>
      <div class="fake-email" v-else></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mini-profile {
  width: 100%;
  background: var(--back-a);
  border-radius: 0.75rem;
  padding: 0.5rem;
  border-radius: 1.5rem;
  background: var(--back-b);
  border: 1px solid var(--liquid-glass-border);
  box-shadow: var(--box-shadow);
  display: flex;
  gap: 1rem;

  .fake-username, .fake-email {
    height: 30%;
    border-radius: 0.25rem;
  }

  .fake-username {
    width: 50%;
  }

  .fake-email {
    width: 70%;
  }

  .img-holder {
    width: 3rem;
    height: 3rem;
    overflow: hidden;
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
      scale: 1.1;
    }

    .box {
      width: 100%;
      height: 100%;
    }
  }

  .text-w {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .username {
      font-size: calc(1.2 * var(--mm));
      color: var(--text-a);
    }

    .email {
      font-size: var(--mm);
      color: var(--text-c);
    }
  }
}

.dark {
  background: var(--back-c);
  border: solid 1px var(--back-d);

  .box, .fake-username, .fake-email {
    background: var(--back-d);
  }
}

.light {
  background: var(--back-b);

  .box, .fake-username, .fake-email {
    background: var(--back-c);
  }
}
</style>
