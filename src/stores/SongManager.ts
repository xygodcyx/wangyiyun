import { computed, onMounted, ref, reactive } from 'vue';
import { defineStore } from 'pinia';
import type { TTrackType } from '@/type';
export const useSongManger = defineStore('songManager', () => {
  const curPlaySongData = reactive({
    song: Object as unknown as TTrackType,
    time: 0
  });
  const index = ref(0);
  const isPlaying = ref<boolean>(false);
  const songs = ref<Array<TTrackType>>([]);
  const nowSong = computed(() => songs.value[index.value]);

  onMounted(() => {
    if (
      !localStorage.getItem('songs') ||
      localStorage.getItem('songs') == 'undefined' ||
      localStorage.getItem('songs') == ''
    ) {
      index.value = 0;
      songs.value = [];
      return;
    }
    if (
      !localStorage.getItem('songData') ||
      localStorage.getItem('songData') == 'undefined' ||
      localStorage.getItem('songData') == ''
    ) {
      index.value = 0;
      songs.value = [];
      return;
    }
    songs.value = JSON.parse(localStorage.getItem('songs') || '');
    curPlaySongData.time = parseFloat(localStorage.getItem('playSongTime') || '0');
    curPlaySongData.song = JSON.parse(localStorage.getItem('songData') || '');
    index.value = findSongIndex(curPlaySongData.song.id);
  });
  const canPlay = computed(() => songs.value.length !== 0);
  const hasSong = (songId: number) => {
    return songs.value.find((song) => song.id === songId);
  };
  const findSongIndex = (songId: number) => {
    return songs.value.findIndex((song) => song.id === songId);
  };
  const addSong = (song: TTrackType) => {
    songs.value.push(song);
    formatIndex();
  };
  const removeSong = (_song: TTrackType) => {
    let _index = songs.value.findIndex((song) => song.id === _song.id);
    songs.value.splice(_index, 1);
    formatIndex();
  };
  const removeAllSong = () => {
    songs.value = [];
    curPlaySongData.time = 0;
    index.value = 0;
    isPlaying.value = false;
  };
  const saveSongData = () => {
    localStorage.setItem('songIndex', String(index.value <= -1 ? index.value : 0));
    localStorage.setItem('songData', JSON.stringify(nowSong.value ? nowSong.value : ''));
    localStorage.setItem('songs', JSON.stringify(songs.value ? songs.value : ''));
  };
  const formatIndex = () => {
    if (index.value >= songs.value.length - 1) {
      index.value = songs.value.length - 1;
    } else if (index.value <= -1) {
      index.value = 0;
    }
  };
  const nextSong = () => {
    let _index = index.value;
    _index++;
    index.value = _index >= songs.value.length ? 0 : _index;
    isPlaying.value = true;
  };
  const randomSong = () => {
    let _index = Math.floor(Math.random() * songs.value.length);
    index.value = _index >= songs.value.length ? 0 : _index;
    isPlaying.value = true;
  };
  const oneSongLoop = () => {
    let _index = index.value;
    index.value = _index >= songs.value.length ? 0 : _index;
    isPlaying.value = true;
  };
  const prevSong = () => {
    let _index = index.value;
    _index--;
    index.value = _index <= 0 ? songs.value.length - 1 : _index;
    isPlaying.value = true;
  };

  return {
    index,
    songs,
    nowSong,
    isPlaying,
    canPlay,
    curPlaySongData,
    prevSong,
    nextSong,
    randomSong,
    oneSongLoop,
    hasSong,
    findSongIndex,
    addSong,
    removeSong,
    removeAllSong,
    saveSongData
  };
});
