<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, onBeforeUnmount, reactive } from 'vue';
import { useGlobalVarStore } from '@/stores/GlobalVar';
import { useSongManger } from '@/stores/SongManager';
import type { TTrackType } from '@/type';
const SongManger = useSongManger();
const GlobalVar = useGlobalVarStore();
const curPlaySong = ref<TTrackType>();
const audioPlayer = ref<HTMLAudioElement>();
const isPlaying = ref<boolean>(false);
const songPlayEnd = ref<boolean>(false);
const songPercentage = ref<number>(0);
const initSongUrl = computed(() => {
  if (!SongManger.canPlay) return '';
  if (!audioPlayer.value) return '';

  return SongManger.nowSong.id;
});
const playSong = () => {
  audioPlayer.value?.play();
  SongManger.isPlaying = true;
};
const pauseSong = () => {
  audioPlayer.value?.pause();
  SongManger.isPlaying = false;
};
const hidePanel = computed(() => {
  if (!SongManger.nowSong) return false;
  return !(SongManger.nowSong?.name === '' && SongManger.nowSong?.al.picUrl === '');
});
const curSong = () => {
  audioPlayer.value?.play();
  curPlaySong.value = SongManger.nowSong;
  SongManger.isPlaying = false;
};
const prevSong = () => {
  SongManger.prevSong();
};
const nextSong = () => {
  SongManger.nextSong();
};
const onAudioEnded = () => {
  songPlayEnd.value = true;
  SongManger.isPlaying = false;
  nextSong();
  console.log('end');
};
onMounted(() => {
  console.log('onMounted');
  audioPlayer.value!.currentTime = SongManger.curPlaySongData.time;
});
nextTick(() => {
  console.log('nextTick');
  console.log(parseFloat(localStorage.getItem('playSongTime') || '0'));
  audioPlayer.value!.currentTime = SongManger.curPlaySongData.time;
  // audioPlayer.value!.currentTime = parseFloat(localStorage.getItem('playSongTime') || '0');
});
onBeforeUnmount(() => {
  console.log('onBeforeUnmount');
  localStorage.setItem('playSongTime', audioPlayer.value!.currentTime.toString());
  audioPlayer.value!.currentTime = SongManger.curPlaySongData.time;
});
const onSongPlaying = () => {
  if (audioPlayer.value == null) return;
  try {
    songPercentage.value = (audioPlayer.value!.currentTime / (SongManger.nowSong!.dt / 1000)) * 100;
    localStorage.setItem('playSongTime', audioPlayer.value!.currentTime.toString());
  } catch (err) {
    console.log('1');
  }
  // console.log(songPercentage.value);
};
const showPlayList = ref<boolean>(false);
const onClickPlayList = () => {
  showPlayList.value = true;
  GlobalVar.songPlayClass.splice(GlobalVar.songPlayClass.indexOf('inPlayList'), 1);
};
const onAfterEnter = () => {
  if (GlobalVar.inPlaylist) {
    GlobalVar.songPlayClass.push('zIndex99');
  }
};
const onAfterLeave = () => {
  GlobalVar.songPlayClass.splice(GlobalVar.songPlayClass.indexOf('zIndex99'), 1);
  if (GlobalVar.inPlaylist) {
    GlobalVar.songPlayClass.push('inPlayList');
  }
};
const onPlayListSongClick = (song: TTrackType) => {
  const index = SongManger.findSongIndex(song.id);
  SongManger.index = index;
  showPlayList.value = false;
  SongManger.saveSongData();
};
const onRemoveSongClick = (song: TTrackType) => {
  console.log(song);
  SongManger.removeSong(song);
  localStorage.setItem('songs', JSON.stringify(SongManger.songs));
};
//删除所有歌曲
const onRemoveAllClick = () => {
  SongManger.removeAllSong();
  showPlayList.value = false;
};
</script>
<template>
  <div class="SongPlay" :class="GlobalVar.songPlayClass" v-show="hidePanel">
    <audio
      ref="audioPlayer"
      :src="`https://music.163.com/song/media/outer/url?id=${initSongUrl}.mp3`"
      autoplay
      @ended="onAudioEnded"
      @timeupdate="onSongPlaying"
    ></audio>
    <div class="left">
      <div class="imgCover">
        <div class="imgBackground">
          <img
            :src="SongManger.nowSong?.al.picUrl"
            :class="SongManger.isPlaying ? 'playing' : ''"
            alt=""
          />
        </div>
      </div>
      <div class="label">
        <n-ellipsis style="max-width: 170px">{{ SongManger.nowSong?.name }}</n-ellipsis>
      </div>
    </div>
    <div class="right">
      <div class="playIcon" @click="SongManger.isPlaying ? pauseSong() : playSong()">
        <n-progress
          class="songProgress"
          type="circle"
          :percentage="songPercentage"
          :show-indicator="false"
          status="success"
        />
        <svg v-show="!SongManger.isPlaying" class="icon bofang" aria-hidden="true">
          <use xlink:href="#icon-bofang"></use>
        </svg>
        <svg v-show="SongManger.isPlaying" class="icon zanting" aria-hidden="true">
          <use xlink:href="#icon-zanting"></use>
        </svg>
      </div>
      <div class="playListIcon" @click="onClickPlayList">
        <svg class="icon playlist2" aria-hidden="true">
          <use xlink:href="#icon-24gl-playlist2"></use>
        </svg>
      </div>
    </div>
  </div>
  <n-drawer
    v-model:show="showPlayList"
    style="width: 60vw; height: 100vh"
    placement="right"
    :on-after-enter="onAfterEnter"
    :on-after-leave="onAfterLeave"
  >
    <div class="playlistSong">
      <div class="top">
        <div class="showSongSum">({{ SongManger.songs.length }})</div>
        <span class="removeAll" v-show="SongManger.songs.length > 0" @click="onRemoveAllClick">
          <span class="label">清除全部</span>
          <svg class="icon lajitong" aria-hidden="true">
            <use xlink:href="#icon-lajitong"></use>
          </svg>
        </span>
      </div>
      <div class="songItem" v-for="(song, index) in SongManger.songs">
        <div class="content">
          <div class="label" @click="onPlayListSongClick(song)">
            <n-ellipsis style="max-width: 130px">{{ song.name }}</n-ellipsis>
          </div>
          <div class="removeSong" @click="onRemoveSongClick(song)">x</div>
        </div>
        <div class="line"></div>
      </div>
    </div>
  </n-drawer>
</template>
<style lang="less" scoped>
.SongPlay.hide {
  opacity: 0;
}
.SongPlay.inPlayListBefore {
  z-index: -1;
}
.SongPlay.zIndex99 {
  z-index: 99;
}
.SongPlay.inPlayList {
  bottom: -0.32rem;
  z-index: 9999;
}
.SongPlay {
  width: 100%;
  height: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 0.4rem;
  position: fixed;
  bottom: 0.76rem;
  background-color: #fff;
  transition:
    background-color,
    opacity 0.3s;
  transition-timing-function: ease-in-out;
  z-index: 999;
  .left {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .imgCover {
      width: 80px;
      height: 40px;
      position: absolute;
      left: 30px;

      .imgBackground {
        width: 40px;
        height: 40px;
        background-color: #000000;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        animation-duration: 4s;
        animation-timing-function: linear;
        animation-delay: 0s;
        animation-iteration-count: infinite;
        animation-fill-mode: both;
        animation-play-state: paused;
        animation-name: songPlaying;
      }
      img.playing {
        animation-play-state: running;
      }
    }
    .label {
      width: 170px;
      font-size: 16px;
      margin-left: 70px;
    }
  }
  .right {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .playIcon {
      margin-right: 0.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .songProgress {
        width: 40px;
        height: 40px;
        position: absolute;
      }
      .bofang {
        width: 30px;
        height: 30px;
      }
      .zanting {
        width: 26px;
        height: 26px;
      }
    }
    .playListIcon {
      margin-right: 10px;
      .playlist2 {
        width: 26px;
        width: 26px;
        color: #000000;
        fill: #000000;
      }
    }
  }
}
@keyframes songPlaying {
  0% {
    transform: rotateZ(0);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
//播放列表
.playlistSong {
  width: 100%;
  .top {
    position: relative;
    .showSongSum {
      position: absolute;
      left: 0.2rem;
      top: 0.08rem;
    }
    .removeAll {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      .label {
        margin-top: 4px;
      }
      .lajitong {
        width: 20px;
        height: 20px;
        margin-top: 4px;
        margin-left: 6px;
      }
    }
  }
  .songItem {
    padding: 12px;
    margin-top: 10px;
    .content {
      display: flex;
      justify-content: space-between;
      .removeSong {
        min-width: 40px;
        height: 40px;
        // background-color: #0000003b;
        font-size: 18px;
        text-align: center;
      }
    }
    .line {
      border: 1px solid black;
      opacity: 0.4;
    }
  }
}
</style>
