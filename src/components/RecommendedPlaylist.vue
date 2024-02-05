<script setup lang="ts">
import RecommendedSong from '../components/RecommendedSong.vue';
import { getRecommendedPlaylist } from '@/request/GetRecommendedPlaylist';
import { onMounted, ref } from 'vue';
import type { RecommendedSongType } from '../unit';

const recommendedPlaylist = ref<RecommendedSongType[]>([]);
const recommendedReallyPlaylist = ref<RecommendedSongType[]>([]);
onMounted(async () => {
  const result = await getRecommendedPlaylist(false);
  const data: RecommendedSongType[] = result.data.result;
  console.table(data);
  data.map((play) => {
    const {
      id,
      alg,
      canDislike,
      copywriter,
      highQuality,
      name,
      picUrl,
      playCount,
      trackCount,
      trackNumberUpdateTime,
      type
    } = play;
    recommendedPlaylist.value.push({
      id,
      alg,
      canDislike,
      copywriter,
      highQuality,
      name,
      picUrl,
      playCount,
      trackCount,
      trackNumberUpdateTime,
      type
    });
  });
  for (let i = 0; i < 6; ) {
    let randomIndex = Math.floor(Math.random() * recommendedPlaylist.value.length);
    let index = checkRandomIndex(randomIndex);
    if (index || index === 0) {
      recommendedReallyPlaylist.value.push(recommendedPlaylist.value[index]);
      i++;
    }
  }
  console.log(recommendedReallyPlaylist.value);
});
const checkRandomIndex = (index: number) => {
  let randomIndex = Math.floor(Math.random() * recommendedPlaylist.value.length);
  if (index === randomIndex) return false;
  else return randomIndex;
};
</script>
<template>
  <div class="recommendedPlaylist" id="recommendedPlaylist">
    <div class="topBar">
      <div class="left">
        <span class="label">推荐歌单</span>
        <svg class="icon yousanjiao" aria-hidden="true">
          <use xlink:href="#icon-yousanjiao"></use>
        </svg>
      </div>
      <div class="right">
        <svg class="icon gengduo" aria-hidden="true">
          <use xlink:href="#icon-gengduo1"></use>
        </svg>
      </div>
    </div>

    <div class="recommendedPlaySongs">
      <n-carousel :loop="false" draggable>
        <div class="playListItem">
          <RecommendedSong
            no-play-icon
            no-right-top-statistic-data
            :recommended-song-data="recommendedPlaylist[0]"
          ></RecommendedSong>
          <RecommendedSong :recommended-song-data="recommendedPlaylist[1]"></RecommendedSong>
          <RecommendedSong :recommended-song-data="recommendedPlaylist[2]"></RecommendedSong>
        </div>
        <div class="playListItem">
          <RecommendedSong :recommended-song-data="recommendedPlaylist[3]"></RecommendedSong>
          <RecommendedSong :recommended-song-data="recommendedPlaylist[4]"></RecommendedSong>
          <RecommendedSong :recommended-song-data="recommendedPlaylist[5]"></RecommendedSong>
        </div>
        <template #dots="{ total, currentIndex, to }">
          <ul class="custom-dots">
            <li
              v-for="index of total"
              :key="index"
              :class="{ ['is-active']: currentIndex === index - 1 }"
              @click="to(index - 1)"
            />
          </ul>
        </template>
      </n-carousel>
    </div>
  </div>
</template>
<style lang="less" scoped>
#recommendedPlaylist.recommendedPlaylist {
  margin-top: 0.4rem;
  overflow: visible;
  .topBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.12rem;
    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .label {
        font-size: 0.36rem;
        font-weight: bold;
      }
      .yousanjiao {
        width: 0.38rem;
        height: 0.38rem;
        margin-bottom: 0.08rem;
        filter: invert(0%);
      }
    }
    .right {
      .gengduo:hover {
        opacity: 0.6;
      }
      .gengduo {
        width: 0.4rem;
        height: 0.4rem;
        opacity: 1;
        cursor: pointer;
        filter: invert(100%);
        transition: opacity 0.3s;
      }
    }
  }
  .recommendedPlaySongs {
    .playListItem {
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .custom-dots {
      display: flex;
      margin: 0;
      padding: 0;
      margin-left: 40%;
      margin-top: 0.04rem;
      // position: absolute;
      bottom: 0px;
      left: 40%;
      li {
        display: inline-block;
        width: 12px;
        height: 4px;
        margin: 0 3px;
        border-radius: 4px;
        background-color: rgb(201, 177, 177);
        transition:
          width 0.3s,
          background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
      }

      li.is-active {
        width: 40px;
        background: #000000fc;
      }
    }
  }
}
</style>
