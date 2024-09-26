import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { TTrackType } from '@/type';

export const useCurrentSongStore = defineStore('currentSong', () => {
  const curSong = ref<TTrackType>();
  return {
    curSong
  };
});
