import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalVarStore = defineStore('globalVar', () => {
  const songPlayClass = ref<Array<string>>([]);
  const inPlaylist = ref<boolean>(false);
  return { songPlayClass, inPlaylist };
});
