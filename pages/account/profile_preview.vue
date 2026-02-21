<script setup lang="ts">
// MAIN IMPORTS
// vue & store
import { computed } from "vue";
import { useUserStore } from "../../stores/useUserStore";
import { useAuthStore } from "../../stores/useAuthStore";
const userStore = useUserStore();
const authStore = useAuthStore();

// CONTENT
// props
const props = defineProps<{
  data: boolean;
}>();
// icon url
const avatarUrl = computed(() => {
  if (userStore.availableAvatars.length === 0) return "";
  const index = userStore.userData.common.icon;
  return userStore.availableAvatars[index];
});
// vars
const userEmail = computed(() => userStore.userData.common.email);
const username = computed(() => userStore.userData.common.username);
</script>

<template>
  <div class="top" :class="`${props.data ? 'dark' : 'light'}`">
    <div class="img-holder" v-if="avatarUrl">
      <img v-if="authStore.isAuthenticated" :src="avatarUrl" alt="profile icon" class="icon" />
      <div v-else class="box"></div>
    </div>
    <div class="text-w">
      <div class="email" v-if="authStore.isAuthenticated">{{ userEmail }}</div>
      <div class="fake-email" v-else></div>
      <div class="username" v-if="authStore.isAuthenticated">
        {{ username }}
      </div>
      <div class="fake-username" v-else></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.top {
  width: 100%;
  height: 4rem;
  background: var(--back-b);
  border-radius: 0.75rem;
  padding: 0.5rem;
  display: flex;
  gap: 1rem;

  .fake-username, .fake-email {
    height: 50%;
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
    gap: 0.5rem;
    justify-content: space-between;

    .email {
      font-size: 0.95rem;
      color: var(--text-a);
    }

    .username {
      font-size: 0.85rem;
      color: var(--text-c);
    }
  }
}
.dark {
  background: var(--back-c);
  border: solid 1px var(--back-d);

  .box,
  .fake-username,
  .fake-email {
    background: var(--back-d);
  }
}
.light {
  background: var(--back-b);

  .box,
  .fake-username,
  .fake-email {
    background: var(--back-c);
  }
}
</style>
