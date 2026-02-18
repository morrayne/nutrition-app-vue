// MAIN IMPORTS
// vue
import { ref } from "vue";
// pinia
import { defineStore } from "pinia";
// types
import type { config_friends_type } from './store_types';

// MAIN EXPORT
export const useUserPrivateStore = defineStore("userPrivate", () => {
  // STATE
  const privateData = ref<config_friends_type>({
    email: "",
    lang: "en",
    theme: "light",
    monochrome: "mono",
    friends: [],
  });

  // ACTIONS
  // update multiple fields at once
  const updatePrivateData = (data: Partial<config_friends_type>) => {
    Object.assign(privateData.value, data);
  };
  // email
  const setEmail = (email: string) => {
    privateData.value.email = email;
  };
  // language
  const setLang = (lang: "ru" | "en") => {
    privateData.value.lang = lang;
  };
  // theme
  const setTheme = (theme: "light" | "dark") => {
    privateData.value.theme = theme;
  };
  // monochrome
  const setMonochrome = (mode: "mono" | "multi") => {
    privateData.value.monochrome = mode;
  };

  // FRIENDS
  // add
  const addFriend = (friendId: string) => {
    if (!privateData.value.friends.includes(friendId)) {
      privateData.value.friends.push(friendId);
    }
  };
  // remove
  const removeFriend = (friendId: string) => {
    const index = privateData.value.friends.indexOf(friendId);
    if (index > -1) {
      privateData.value.friends.splice(index, 1);
    }
  };
  // checks if already in friend list
  const hasFriend = (friendId: string): boolean => {
    return privateData.value.friends.includes(friendId);
  };

  // PRIVATE DATA
  // get
  const getPrivateData = () => ({
    ...privateData.value
  });
  // clear
  const clearPrivateData = () => {
    privateData.value = {
      email: "",
      lang: "en",
      theme: "light",
      monochrome: "mono",
      friends: [],
    };
  };

  // EXPORTS
  return {
    // state
    privateData,
    // actions
    updatePrivateData, setEmail, setLang, setTheme, setMonochrome, addFriend, removeFriend, hasFriend, getPrivateData, clearPrivateData
  };
});
