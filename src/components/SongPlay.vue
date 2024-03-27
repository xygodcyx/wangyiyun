<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  onBeforeUnmount,
  reactive,
  watch,
  watchEffect
} from 'vue';
import { useGlobalVarStore } from '@/stores/GlobalVar';
import { useSongManger } from '@/stores/SongManager';
import type { TTrackType } from '@/type';
import AlertBox from './AlertBox/';
import request from '@/request';
const { getSongUrlNew } = request;
const SongManger = useSongManger();
const GlobalVar = useGlobalVarStore();
const curPlaySong = ref<TTrackType>();
const audioPlayer = ref<HTMLAudioElement>();
const isPlaying = ref<boolean>(false);
const songPlayEnd = ref<boolean>(false);
const songPercentage = ref<number>(0);
// const initSongUrl = computed(async () => {
//   if (!SongManger.canPlay) return '';
//   if (!audioPlayer.value) return '';
//   const data = (await getSongUrlNew(SongManger.nowSong.id)).data.data[0];

//   return data.url;
// });
const SongManagerSongId = computed(() => {
  return SongManger.nowSong.id;
});
const initSongUrl = ref('');
// watch(
//   SongManagerSongId,
//   async () => {
//     if (!SongManger.canPlay) return '';
//     if (!audioPlayer.value) return '';
//     const data = (await getSongUrlNew(SongManger.nowSong.id)).data.data[0];
//     initSongUrl.value = data.url;
//   },
//   {
//     immediate: true
//   }
// );
type SongDetailDataType = {
  br: number;
  level: string;
  url: string;
  id: number;
  fee: number;
  type: string;
};
watchEffect(async () => {
  if (!SongManger.canPlay) return '';
  if (!audioPlayer.value) return '';
  const data = (await getSongUrlNew(SongManger.nowSong.id)).data.data[0];
  console.log(data);
  initSongUrl.value = await data.url;
  console.log();
});
window.addEventListener('copy', (e) => {
  // e.preventDefault();
  // alert('打钱');
});

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

enum PLAY_MODE {
  NEXT_SONG,
  RANDOM_SONG,
  ONE_SONG
}
let play_mode = ref<PLAY_MODE>(PLAY_MODE.RANDOM_SONG);
const onAudioEnded = () => {
  songPlayEnd.value = true;
  SongManger.isPlaying = false;
  switch (play_mode.value) {
    case PLAY_MODE.NEXT_SONG:
      nextSong();
      break;
    case PLAY_MODE.RANDOM_SONG:
      randomSong();
      break;
    case PLAY_MODE.ONE_SONG:
      oneSong();
      break;
  }
  localStorage.setItem('songs', JSON.stringify(SongManger.songs));
  audioPlayer.value!.currentTime = 0;
  audioPlayer.value!.pause();
  audioPlayer.value!.play();
};
//change play_mode
const changePlayMode = () => {
  switch (play_mode.value) {
    case PLAY_MODE.NEXT_SONG:
      play_mode.value = PLAY_MODE.RANDOM_SONG;
      localStorage.setItem('play_mode_str', 'randomSong');
      showAlert('随机播放');
      break;
    case PLAY_MODE.RANDOM_SONG:
      play_mode.value = PLAY_MODE.ONE_SONG;
      localStorage.setItem('play_mode_str', 'oneSong');
      showAlert('单曲循环');
      break;
    case PLAY_MODE.ONE_SONG:
      play_mode.value = PLAY_MODE.NEXT_SONG;
      localStorage.setItem('play_mode_str', 'nextSong');
      showAlert('顺序播放');
      break;
  }
  console.log(localStorage.getItem('play_mode_str'));
};
const showAlert = (
  title: string,
  type = 'primary',
  duration = 1000,
  callback: Function = () => {}
) => {
  AlertBox.alert(
    {
      title: title,
      type: type,
      duration: duration
    },
    callback
  );
};
const nextSong = () => {
  SongManger.nextSong();
};
const randomSong = () => {
  SongManger.randomSong();
};
const oneSong = () => {
  SongManger.oneSongLoop();
};

nextTick(() => {
  parseFloat(localStorage.getItem('playSongTime') || '0');
  audioPlayer.value!.currentTime = SongManger.curPlaySongData.time;
  // audioPlayer.value!.currentTime = parseFloat(localStorage.getItem('playSongTime') || '0');
});
onBeforeUnmount(() => {
  localStorage.setItem('playSongTime', audioPlayer.value!.currentTime.toString());
  audioPlayer.value!.currentTime = SongManger.curPlaySongData.time;
});
const onSongPlaying = () => {
  if (audioPlayer.value == null) return;
  try {
    songPercentage.value = (audioPlayer.value!.currentTime / (SongManger.nowSong!.dt / 1000)) * 100;
    localStorage.setItem('playSongTime', audioPlayer.value!.currentTime.toString());
  } catch (err) {}
};
const showPlayList = ref<boolean>(false);
const onClickPlayList = () => {
  showPlayList.value = true;
  GlobalVar.songPlayClass.splice(GlobalVar.songPlayClass.indexOf('inPlayList'), 1);
};
const onAfterEnter = () => {
  if (GlobalVar.inPlaylist) {
    GlobalVar.songPlayClass.push('zIndex99');
  } else if (GlobalVar.inSearchDetail) {
    GlobalVar.removeSongPlayClass('inSearchDetail');
  }
};
const onAfterLeave = () => {
  GlobalVar.songPlayClass.splice(GlobalVar.songPlayClass.indexOf('zIndex99'), 1);
  if (GlobalVar.inPlaylist) {
    GlobalVar.songPlayClass.push('inPlayList');
  } else if (GlobalVar.inSearchDetail) {
    GlobalVar.addSongPlayClass('inSearchDetail');
  }
};
const onPlayBtnClick = () => {
  SongManger.isPlaying ? pauseSong() : playSong();
};
const playSong = () => {
  audioPlayer.value?.play();
  SongManger.isPlaying = true;
  showAlert('继续播放');
};
const pauseSong = () => {
  audioPlayer.value?.pause();
  SongManger.isPlaying = false;
  showAlert('暂停播放');
};

const onPlayListSongClick = (song: TTrackType) => {
  const index = SongManger.findSongIndex(song.id);
  SongManger.index = index;
  showPlayList.value = false;
  audioPlayer.value!.play();
  SongManger.isPlaying = true;
  SongManger.curPlaySongData.time = 0;
  SongManger.saveSongData();
};
const onRemoveSongClick = (song: TTrackType) => {
  SongManger.removeSong(song);
  localStorage.setItem('songs', JSON.stringify(SongManger.songs));
};
//删除所有歌曲
const onRemoveAllClick = () => {
  SongManger.removeAllSong();
  showPlayList.value = false;
};
//允许用户自动播放
const initSong = () => {
  SongManger.isPlaying = true;
  audioPlayer.value!.currentTime = SongManger.curPlaySongData.time;
};
onMounted(async () => {
  let play_mode_str = localStorage.getItem('play_mode_str');
  switch (play_mode_str) {
    case 'nextSong':
      play_mode.value = PLAY_MODE.NEXT_SONG;
      break;
    case 'randomSong':
      play_mode.value = PLAY_MODE.RANDOM_SONG;
      break;
    case 'oneSong':
      play_mode.value = PLAY_MODE.ONE_SONG;
      break;
    default:
      play_mode.value = PLAY_MODE.NEXT_SONG;
  }
  try {
    await audioPlayer.value?.pause();
    // initSong();
    enableBodyScroll();
  } catch (err) {}
  isShowAllowAutoPlayBox.value = true;
  isShowAllowAutoPlayBox.value = false;
  disableBodyScroll();
});
const isShowAllowAutoPlayBox = ref(false);
const isShowMask = ref(true);
const onClickConfirmButton = () => {
  isShowAllowAutoPlayBox.value = false;
  audioPlayer.value?.play();
  initSong();
  enableBodyScroll();
};
const onClickCancelButton = () => {
  isShowAllowAutoPlayBox.value = false;
  enableBodyScroll();
};
const disableBodyScroll = () => {
  if (document.body.scrollTop != 0) {
    document.body.style.top = -document.body.scrollTop + 'px';
  }
  document.body.style.position = 'fixed';
};

const enableBodyScroll = () => {
  document.body.style.position = '';
  document.body.style.top = '';
};
</script>
<template>
  <div v-show="isShowAllowAutoPlayBox" class="allowAutoPlayBox">
    <div class="mask" v-show="isShowMask"></div>
    <div class="box">
      <div class="content">
        检测到您的浏览器不允许我们自动播放音频，我们在这里承诺，不会肆意播放未经您操作的音频（广告、背景音乐等等...），我们希望您可以允许我们自动播放以获取最佳体验。
      </div>
      <div class="title">您需要自动播放吗？</div>
      <div class="confirm" @click="onClickConfirmButton">
        <div class="background"></div>
        <div class="label">需要</div>
      </div>
      <div class="cancel" @click="onClickCancelButton">
        <div class="background"></div>
        <div class="label">不需要</div>
      </div>
    </div>
  </div>

  <div class="SongPlay" :class="GlobalVar.songPlayClass" v-show="hidePanel">
    <!-- <audio
      ref="audioPlayer"
      :src="`https://music.163.com/song/media/outer/url?id=${initSongUrl}.mp3`"
      autoplay
      @ended="onAudioEnded"
      @timeupdate="onSongPlaying"
    ></audio> -->
    <audio
      ref="audioPlayer"
      :src="initSongUrl"
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
      <div class="playMode" @click="changePlayMode">
        <div class="playModeItem" v-show="play_mode == PLAY_MODE.NEXT_SONG">
          <div class="background"></div>
          <svg class="icon shunxubofang" aria-hidden="true">
            <use xlink:href="#icon-shunxubofang"></use>
          </svg>
        </div>
        <div class="playModeItem" v-show="play_mode == PLAY_MODE.RANDOM_SONG">
          <div class="background"></div>
          <svg class="icon shuffle" aria-hidden="true">
            <use xlink:href="#icon-16gl-shuffle"></use>
          </svg>
        </div>
        <div class="playModeItem" v-show="play_mode == PLAY_MODE.ONE_SONG">
          <div class="background"></div>
          <svg class="icon loop" aria-hidden="true">
            <use xlink:href="#icon-icon-"></use>
          </svg>
        </div>
      </div>
      <div class="playIcon" @click="onPlayBtnClick">
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
.allowAutoPlayBox {
  .mask {
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: #000000;
    opacity: 0.4;
    position: absolute;
    z-index: 99999;
  }
  .box {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 80vw;
    height: 400px;
    transform: translate(-50%, -50%);
    background-color: antiquewhite;
    padding: 10px;
    z-index: 999999;
    .content {
      margin-bottom: 10px;
      font-size: 22px;
      text-shadow: 1px 1px;
      color: #67574c;
    }
    .title {
      position: absolute;
      bottom: 1.4rem;
      left: 0.6rem;
      font-size: 22px;
      text-shadow: 1px 1px;
      color: #d8ce80;
    }
    .confirm {
      position: absolute;
      bottom: 0.4rem;
      right: 0.4rem;
      .background {
        width: 100%;
        height: 40px;
        background-color: #ee9852;
        position: absolute;
        border-radius: 60px;
        opacity: 0.5;
      }
      .label {
        font-size: 22px;
      }
    }
    .cancel {
      position: absolute;
      bottom: 0.4rem;
      right: 1.8rem;
      .background {
        width: 100%;
        height: 30px;
        background-color: #f2d6bf;
        position: absolute;
        border-radius: 60px;
        opacity: 0.5;
      }
      .label {
        font-size: 18px;
      }
    }
  }
}
.SongPlay.hide {
  opacity: 0;
}
.SongPlay.inSearchDetail {
  z-index: 99999;
  bottom: -20px;
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
    .playMode {
      position: absolute;
      right: -30px;
      top: 10px;
      .playModeItem {
        position: absolute;
        width: 46px;
        height: 46px;
        bottom: -39px;
        right: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        // background-color: #0000004a;
        .background {
          width: 90%;
          height: 90%;
          position: absolute;
          background-color: aliceblue;
          opacity: 0.3;
          border-radius: 50px;
        }
        .icon {
          width: 80%;
          height: 80%;
        }
      }
    }
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
