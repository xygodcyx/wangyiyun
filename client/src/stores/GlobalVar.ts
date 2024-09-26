import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useGlobalVarStore = defineStore('globalVar', () => {
  const songPlayClass = ref<Array<string>>([]);
  const inPlaylist = ref<boolean>(false);
  const inSearchDetail = ref<boolean>(false);
  const inSongDetail = ref<boolean>(false);

  const addSongPlayClass = (className = '') => {
    removeAllSongPlayClass();
    console.log('add  ', className);
    let has = songPlayClass.value.indexOf(className) !== -1;
    if (!has) songPlayClass.value.push(className);
  };
  const removeSongPlayClass = (className = '') => {
    console.log('remove  ', className);
    songPlayClass.value.splice(songPlayClass.value.indexOf(className), 1);
  };
  const removeAllSongPlayClass = () => {
    songPlayClass.value = [];
  };
  return {
    songPlayClass,
    inPlaylist,
    inSearchDetail,
    inSongDetail,
    addSongPlayClass,
    removeSongPlayClass,
    removeAllSongPlayClass
  };
});
