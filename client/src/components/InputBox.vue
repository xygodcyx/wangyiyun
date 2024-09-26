<template>
  <div class="inputBox relative">
    <input
      :placeholder="searchPlaceholderKeyWord.showKeyword"
      class="input"
      type="text"
      v-model:="showInputValue"
      @input="onShowInputValueChange"
      @keydown.enter="OpenSearchDetail"
      @click="OpenSearchDetail"
    />
    <svg class="icon sousuo absolute" aria-hidden="true" @click="OpenSearchDetail">
      <use xlink:href="#icon-sousuo"></use>
    </svg>
    <svg class="icon saoyisao absolute" aria-hidden="true">
      <use xlink:href="#icon-saoyisao"></use>
    </svg>
  </div>
  <n-drawer
    v-model:show="showSearchDetail"
    :on-after-enter="onDrawerAfterEnter"
    :on-after-leave="onDrawerAfterLeave"
    style="width: 100vw; height: 100vh"
    placement="bottom"
  >
    <div id="searchDetail" class="searchDetail">
      <div class="backHome">
        <div class="background"></div>
        <svg @click="onBackHomeClick" class="icon back absolute" aria-hidden="true">
          <use xlink:href="#icon-i-back"></use>
        </svg>
      </div>
      <div class="detailInput">
        <input
          :placeholder="searchPlaceholderKeyWord.showKeyword"
          class="input"
          type="text"
          v-model="searchValue"
          @focusin="onInputDetailChange"
          @focusout="onInputDetailChange"
          @input="onInputDetailChange"
          @compositionstart="onInputCompositionStart"
          @compositionend="onInputCompositionEnd"
        />
        <svg
          @click="onClickSuggestLine(searchValue)"
          class="icon sousuo absolute"
          aria-hidden="true"
        >
          <use xlink:href="#icon-sousuo"></use>
        </svg>
      </div>
      <div class="searchSuggestBox" v-show="showSearchSuggestBox">
        <div
          class="searchSuggestLine"
          v-bind:key="index"
          v-for="(searchSuggest, index) in searchSuggestValue"
          @click="onClickSuggestLine(searchSuggest.keyword)"
        >
          {{ searchSuggest.keyword }}
        </div>
      </div>
      <div class="searchLoading tipBox" v-show="isLoading">正在加载...</div>
      <div class="showTipInfo tipBox" v-show="isShowTipInfo">
        <b style="text-decoration-line: underline" @click="onClickSearchTip">搜索</b>这个关键字吗?
      </div>
      <div class="searchHistory">
        <div
          class="historyItem"
          :key="index"
          v-for="(history, index) in searchHistory"
          @click="onHistoryItemClick(history.label)"
        >
          <div class="background"></div>
          <div class="label">{{ history.label }}</div>
          <div class="close">x</div>
        </div>
      </div>
      <div class="searchSongsBox" v-show="isShowSearchSongBox">
        <div class="songItem" @click="onSongClick(songData)" v-for="songData in songsData">
          <Song :songData="songData" :isShowIndex="false"></Song>
        </div>
      </div>
    </div>
  </n-drawer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import requests from '../request';
import { useGlobalVarStore } from '@/stores/GlobalVar';
import { useSongManger } from '@/stores/SongManager';
const SongManger = useSongManger();
const GlobalVar = useGlobalVarStore();
const { searchDefaultKeyWord, searchSuggest, searchCloud } = requests;
const showInputValue = ref('');
const onShowInputValueChange = (e: Event) => {
  const target: HTMLInputElement = e.target as HTMLInputElement;
  showInputValue.value = '';
  // searchValue.value += target.value;
  console.log(target.value);
  OpenSearchDetail();
};
//open search
const showSearchDetail = ref(false);
const OpenSearchDetail = () => {
  showSearchDetail.value = true;
  GlobalVar.songPlayClass.push('inSearchDetail');
};
type TSearchKeyWord = {
  realkeyword: string;
  showKeyword: string;
};
const searchPlaceholderKeyWord = ref<TSearchKeyWord>({
  realkeyword: '',
  showKeyword: ''
});
onMounted(async () => {
  const result = await searchDefaultKeyWord(true);
  searchPlaceholderKeyWord.value = result.data.data;
  getSearchHistory();
});

//search suggest

const isLoading = ref(false);
const searchValue = ref('');
const searchSuggestValue = ref();
const canSearch = ref(true);
const showSearchSuggestBox = ref(true);
const isShowTipInfo = ref(false);

//进入搜索页面时触发

const onDrawerAfterEnter = () => {
  onInputDetailChange();
  GlobalVar.inSearchDetail = true;
  isLoading.value = false;
};
const onDrawerAfterLeave = () => {
  GlobalVar.removeSongPlayClass('inSearchDetail');
  GlobalVar.inSearchDetail = false;
};
//在键入中文时不触发搜索，当输入完毕时再触发搜索
const onInputCompositionStart = () => {
  canSearch.value = false;
};
const onInputCompositionEnd = () => {
  canSearch.value = true;
  onInputDetailChange();
};

const onInputDetailChange = async () => {
  if (searchValue.value === '') {
    searchSuggestValue.value = [];
    isShowTipInfo.value = false;
    isLoading.value = false;
    return;
  }
  if (isLoading.value || !canSearch.value) return;
  showSearchSuggestBox.value = true;
  isLoading.value = true;
  isShowTipInfo.value = false;

  const result = await searchSuggest(searchValue.value);
  isLoading.value = false;
  searchSuggestValue.value = result.data?.result?.allMatch;
  if (!searchSuggestValue.value) {
    isShowTipInfo.value = true;
  } else {
    isShowTipInfo.value = false;
  }
  if (searchValue.value === '') {
    searchSuggestValue.value = [];
    isShowTipInfo.value = false;
    isLoading.value = false;
    return;
  }
};

//click suggestLine
const onClickSuggestLine = (keyword: string) => {
  if (keyword === '') {
    keyword = searchPlaceholderKeyWord.value.realkeyword;
  }
  startSearch(keyword);
  searchValue.value = keyword;
  showSearchSuggestBox.value = false;
  isLoading.value = true;
};
//search history
type historyType = {
  label: string;
  time: number;
};
const searchHistory = ref<Array<historyType>>([]);
const formatStr = (str: string, len: number = 6) => {
  if (str.length > len) return str.slice(0, len) + '...';
  return str;
};

const getSearchHistory = () => {
  const history: Array<historyType> = JSON.parse(
    localStorage.getItem('searchHistory') || ''
  ) as Array<historyType>;
  history.forEach((h) => {
    h.label = formatStr(h.label);
  });
  searchHistory.value = history;
};
const onHistoryItemClick = (keyword: string) => {
  startSearch(keyword);
};
const removeSameSearchHistory = (historyItem: historyType) => {
  let label = historyItem.label;
  for (let i = 0; i < searchHistory.value.length; i++) {
    let item = searchHistory.value[i];
    if (item.label === label) {
      item.time = new Date().getTime();
      return;
    }
  }
  searchHistory.value.push(historyItem); //如果没有重复的，则添加进去，如果有，则更改原有的时间戳
};
const addSearchHistory = (historyItem: historyType) => {
  // searchHistory.value = [...new Set(searchHistory.value)]; //去重
  removeSameSearchHistory(historyItem); //去重
  searchHistory.value.sort((a, b) => (a.time - b.time > 0 ? -1 : 1)); //根据时间降序排序
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value));
};
//search true
import type { TTrackType } from '../type/index';
//if no searchLine
const onClickSearchTip = () => {
  startSearch(searchValue.value);
};
const startSearch = async (keyword: string = '') => {
  isLoading.value = true;
  if (keyword === '') {
    //normal search
  } else {
    isShowSearchSongBox.value = false;
    //click suggestLine
    isShowTipInfo.value = false;
    isLoading.value = true;
    let searchHistoryItem: historyType = {
      label: keyword,
      time: new Date().getTime()
    };
    addSearchHistory(searchHistoryItem);
    const result = await searchCloud(keyword);
    isLoading.value = false;
    songsData.value = result.data.result.songs;
    isShowSearchSongBox.value = true;
  }
};
const onSongClick = (song: TTrackType) => {
  if (song.fee === 1) {
    return;
  }
  addSong2PlayList(song);
  SongManger.saveSongData();
};
const addSong2PlayList = (song: TTrackType) => {
  let has = false;
  has = SongManger.findSongIndex(song.id) !== -1;
  if (!has) {
    SongManger.addSong(song);
    SongManger.index = SongManger.findSongIndex(song.id);
  } else {
    SongManger.index = SongManger.findSongIndex(song.id);
  }
  SongManger.isPlaying = true;
};
const songsData = ref<Array<TTrackType>>([]);
const isShowSearchSongBox = ref(false);

//backHome
const onBackHomeClick = () => {
  showSearchDetail.value = false;
};
</script>

<style lang="less" scoped>
.inputBox {
  width: 100%;
  .input {
    width: 100%;
    height: 30px;
    margin: 0 auto;
    border-radius: 14px;
    text-indent: 30px;
    border: 1px solid #d8dbfa;
    line-height: 30px;
    outline: none;
    font-size: 14px;
    background: linear-gradient(to right, #d8dbfa47, #f3d7ee57);
  }
  .input::placeholder {
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    opacity: 0.8;
    top: 0.16rem;
    position: absolute;
  }
  .icon {
    width: 16px;
    height: 16px;
  }
  .sousuo {
    width: 14px;
    height: 14px;
    top: 0.22rem;
    left: 0.2rem;
  }
  .saoyisao {
    top: 0.2rem;
    right: 0.16rem;
  }
}
#searchDetail.searchDetail {
  width: 100%;
  .backHome {
    width: 30px;
    margin-left: 10px;
    margin-top: 10px;
    .background {
      width: 0.72rem;
      height: 0.72rem;
      background-color: #faebd8;
      position: absolute;
      border-radius: 40px;
    }
    .back {
      margin-left: 4px;
      margin-top: 4px;
    }
  }
  .detailInput {
    position: relative;
    box-sizing: border-box;
    width: 70vw;
    --height: 36px;
    height: var(--height);
    border: 1px solid #f9c4ac;
    border-radius: 20px;
    margin-left: 1.2rem;
    margin-top: 20px;
    margin-bottom: 10px;
    outline: none;
    input {
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      border: none;
      text-indent: 30px;
      border-radius: 20px;
      outline: none;
    }
    input::placeholder {
      font-size: 14px;
      opacity: 0.8;
    }
    .sousuo {
      position: absolute;
      width: 20px;
      height: 20px;
      right: 20px;
      top: 8px;
    }
  }
  .searchSuggestBox {
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .searchSuggestLine {
      --height: 30px;
      width: 70%;
      height: var(--height);
      line-height: var(--height);
      text-align: center;
      background-color: #f34d4d;
      margin-bottom: 4px;
      border-radius: 10px;
    }
  }
  .searchHistory {
    width: 86%;
    margin: 0 auto;
    display: flex;
    gap: 16px 10px;
    flex-wrap: wrap;
    text-align: center;
    margin-top: 10px;
    margin-left: 30px;
    .historyItem {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 64px;
      max-width: 86px;
      height: 28px;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      .background {
        width: 100%;
        height: 100%;
        background-color: #d2d2d26d;
        position: absolute;
      }
      .label {
        font-size: 14px;
      }
      .close {
        position: absolute;
        font-size: 14px;
        top: -8px;
        display: block;
        right: 0;
      }
    }
    .historyItem:hover {
      .close {
        display: block;
      }
    }
  }
  .searchSongsBox {
    display: flex;
    height: 130vh;
    margin-top: 0;
    flex-direction: column;
    .songItem {
      margin: 20px;
    }
  }
}
.tipBox {
  font-size: 22px;
  text-align: center;
}
</style>
