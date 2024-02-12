<script setup lang="ts">
import requests from '@/request';
const { getPlaylistDetailDynamic, getPlaylistDetail, getPlaylistAllSongs } = requests;
///歌单详细页面，点击歌单图标弹出来的那个
import type {
  TFormattingUnitReturnType,
  TPlayListDynamicType,
  TPlayListDetailType,
  TTrackType,
  TPlayListAllSongs
} from '@/type';
import { formattingName, formattingUnit } from '@/Func';
import { ref, computed, onUnmounted, reactive, onMounted } from 'vue';
import { useGlobalVarStore } from '@/stores/GlobalVar';
import { useSongManger } from '@/stores/SongManager';
const SongManger = useSongManger();
const GlobalVar = useGlobalVarStore();
const active = defineModel('active', {
  type: Boolean,
  default: true
});
const placement = defineModel('placement', {
  type: String,
  default: 'top'
});
const props = defineProps({
  recommendedSongDataId: {
    type: Number,
    default: 0
  }
});
const onClose = () => {
  active.value = false;
};
const drawer = ref();

const share = reactive<TFormattingUnitReturnType>({
  number: 0,
  unit: ''
});
const comment = reactive<TFormattingUnitReturnType>({
  number: 0,
  unit: ''
});
const booked = reactive<TFormattingUnitReturnType>({
  number: 0,
  unit: ''
});
const PlaylistDetailDynamic = ref<TPlayListDynamicType>();
const PlayListDetail = ref<TPlayListDetailType>();
//获取歌单详细动态
const loading = ref(true);
const first = ref(true);
const onAfterEnter = async () => {
  await GetPlaylistDetailDynamic(props.recommendedSongDataId);
  await GetPlaylistDetail(props.recommendedSongDataId);
  if (first.value) {
    await GetPlaylistAllSongs(props.recommendedSongDataId);
    first.value = false;
  }
  loading.value = false;
  GlobalVar.inPlaylist = true;
  GlobalVar.songPlayClass.push('inPlayList');
  GlobalVar.songPlayClass.splice(GlobalVar.songPlayClass.indexOf('inPlayListBefore'), 1);
};
const onAfterLeave = () => {
  console.log('leave');
  GlobalVar.inPlaylist = false;
  GlobalVar.songPlayClass.splice(GlobalVar.songPlayClass.indexOf('inPlayList'), 1);
};
const GetPlaylistDetailDynamic = async (id: number) => {
  const result = await getPlaylistDetailDynamic(id);
  const data: TPlayListDynamicType = result.data;
  PlaylistDetailDynamic.value = data;
  //share
  share.number = formattingUnit(PlaylistDetailDynamic.value.shareCount).number;
  share.unit = formattingUnit(PlaylistDetailDynamic.value.shareCount).unit;
  //comment
  comment.number = formattingUnit(PlaylistDetailDynamic.value.commentCount).number;
  comment.unit = formattingUnit(PlaylistDetailDynamic.value.commentCount).unit;
  //booked
  booked.number = formattingUnit(PlaylistDetailDynamic.value.bookedCount).number;
  booked.unit = formattingUnit(PlaylistDetailDynamic.value.bookedCount).unit;
};

const description = computed(() => {
  // return formattingName(PlayListDetail.value!.description, 28);
  return PlayListDetail.value!.description;
});

//歌曲的数据
const songsData = ref<Array<TTrackType>>([]);
const GetPlaylistAllSongs = async (id: number, limit: number = 20, offset: number = 0) => {
  const result = (await getPlaylistAllSongs(id, limit, offset)).data;
  result.songs.map((_song: TTrackType) => {
    songsData.value?.push(_song);
  });
};
//滚动加载歌曲
const songItem = ref<Array<HTMLElement>>([]);
const loadedPage = ref(1);
type TSrollType = {
  target: EventTarget;
};
type EventTarget = {
  scrollTop: number;
  clientHeight: number;
  scrollHeight: number;
};
type TSrollContentType = {
  scrollTop: number;
  clientHeight: number;
  scrollHeight: number;
};

const loadingMoreSongs = ref(false);
const loadingMoreSong = ref<HTMLElement>();
let canScrollHandel = true;
let hook: any = null;
//末尾的高度设置
const content = ref<HTMLDivElement>();
const onScroll = async (e: TSrollType) => {
  const target: TSrollContentType = e.target;
  const scrollTop = target!.scrollTop;
  const clientHeight = target!.clientHeight;
  const scrollHeight = target!.scrollHeight;
  if (!canScrollHandel) return;
  if (
    scrollTop + clientHeight < scrollHeight - 40 ||
    songsData.value!.length >= PlayListDetail.value!.trackCount
  )
    return;
  // console.log(content.value?.clientHeight);
  //显示加载动画
  canScrollHandel = false;
  console.log('start');
  loadingMoreSongs.value = true;
  loadedPage.value++;
  GlobalVar.songPlayClass.push('hide');

  await GetPlaylistAllSongs(props.recommendedSongDataId, 20, (loadedPage.value - 1) * 20);
  const songHeight = songItem!.value[0].clientHeight;
  const songHeightMargin = 24;
  const allHeight = songHeight + songHeightMargin;
  const howMany = Math.floor(clientHeight / allHeight);
  hook = setTimeout(() => {
    canScrollHandel = true;
    clearTimeout(hook);
  }, 200);
  e.target!.scrollTop += allHeight * howMany;
  console.log('loadedPage：' + loadedPage.value);
  console.log('done');
  loadingMoreSongs.value = false;
  GlobalVar.songPlayClass.splice(GlobalVar.songPlayClass.indexOf('hide'), 1);
};
//获取歌单的详细数据
const GetPlaylistDetail = async (id: number) => {
  const result: TPlayListDetailType = (await getPlaylistDetail(id)).data.playlist;
  PlayListDetail.value = result;
  // songData.value = result.tracks;
};

//播放歌曲

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

const onSongClick = (song: TTrackType) => {
  if (song.fee === 1) {
    console.log('no play');
    return;
  }
  console.log(song);
  addSong2PlayList(song);
  SongManger.saveSongData();
};
//播放全部歌曲
const playAllSong = async () => {
  console.log('playAllStart');
  await playAllSongSync();
  console.log('playAllDone');
  SongManger.index = 0;
};
const allCanPlay = computed(() => {
  let sum = 0;
  songsData.value.forEach((song) => {
    if (song.fee === 1) {
      //pass vip;
    } else {
      sum++;
    }
  });
  return sum;
});
const playAllSongSync = () => {
  return new Promise((resolve, reject) => {
    SongManger.removeAllSong();
    songsData.value.forEach((song) => {
      if (song.fee === 1) {
        //pass
      } else {
        addSong2PlayList(song);
      }
    });
    resolve(true);
    SongManger.saveSongData();
  });
};
</script>
<template>
  <div id="drawerWrap" class="drawerWrap">
    <!-- style="width: 1000vw;  这个bug让我查疯了 -->
    <n-drawer
      v-model:show="active"
      :placement="placement"
      style="width: 100vw; height: 100vh"
      id="drawer"
      ref="drawer"
      class="drawer"
      :on-after-enter="onAfterEnter"
      :on-after-leave="onAfterLeave"
      :native-scrollbar="false"
      :scrollbar-props="{
        onScroll: onScroll
      }"
    >
      <div id="loading" class="loading" v-if="loading">
        <div class="loadingLabel">数据正在飞速赶来~</div>
      </div>
      <div class="wrap" v-if="!loading">
        <div class="header">
          <div class="topBar">
            <div class="drawerLeft">
              <svg class="icon leftsanjiao" aria-hidden="true" @click="onClose">
                <use xlink:href="#icon-leftsanjiao"></use>
              </svg>
              <span class="label">共享歌单</span>
            </div>
            <div class="right">
              <svg class="icon sousuo2" aria-hidden="true">
                <use xlink:href="#icon-sousuo"></use>
              </svg>
              <svg class="icon sandian" aria-hidden="true">
                <use xlink:href="#icon-sandian"></use>
              </svg>
            </div>
          </div>
          <div class="center">
            <div class="left">
              <div class="img">
                <img :src="PlayListDetail!.coverImgUrl" alt="" />
              </div>
            </div>
            <div class="right">
              <div class="top">
                <div class="label">{{ PlayListDetail?.name }}</div>
                <div class="xiangxiasanjiaoxingIcon">
                  <div class="background"></div>
                  <svg class="icon xiangxiasanjiaoxing" aria-hidden="true">
                    <use xlink:href="#icon-xiangxiasanjiaoxing"></use>
                  </svg>
                </div>
              </div>
              <div class="bottom">
                <img :src="PlayListDetail?.creator.avatarUrl" alt="" class="avatar" />
                <div class="creater">{{ PlayListDetail?.creator.nickname }}-</div>
                <div class="guanzhu">
                  <div class="background"></div>
                  <div class="label">+ 关注</div>
                </div>
              </div>
            </div>
          </div>
          <div class="headerBottom">
            <div class="bottomTop">
              <div class="label">
                <n-ellipsis :line-clamp="1">
                  {{ description }}
                </n-ellipsis>
              </div>
            </div>
            <div class="bottomBar">
              <div class="share bottomBox">
                <svg class="icon fenxiang2" aria-hidden="true">
                  <use xlink:href="#icon-fenxiang2"></use>
                </svg>
                <div class="shareLabel">{{ share.number }}{{ share.unit }}</div>
              </div>
              <div class="comment bottomBox">
                <svg class="icon pinglun" aria-hidden="true">
                  <use xlink:href="#icon-pinglun"></use>
                </svg>
                <div class="commentLabel">{{ comment.number }}{{ comment.unit }}</div>
              </div>
              <div class="booked bottomBox">
                <svg class="icon shoucang1" aria-hidden="true">
                  <use xlink:href="#icon-shoucang1"></use>
                </svg>
                <div class="bookedabel">{{ booked.number }}{{ booked.unit }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="content" ref="content">
          <div class="stickyTopBar">
            <div class="left">
              <div class="background">
                <svg class="icon bofang1" aria-hidden="true">
                  <use xlink:href="#icon-bofang1"></use>
                </svg>
              </div>
              <div class="labelBox" @click="playAllSong">
                <span class="label">播放全部已加载歌曲</span>
                <span class="statisticSum"
                  >({{ songsData.length }}/{{ PlayListDetail!.trackCount }})</span
                >
                <div class="allCanPlay">可播放{{ allCanPlay }}首</div>
              </div>
            </div>
            <div class="right">
              <!-- TODO将来实现下载功能 -->
              <!-- <svg class="icon xiazai1" aria-hidden="true">
                <use xlink:href="#icon-xiazai1"></use>
              </svg>
              <svg class="icon playlistMusic4" aria-hidden="true">
                <use xlink:href="#icon-24gl-playlistMusic4"></use>
              </svg> -->
            </div>
          </div>
          <div class="songs">
            <div
              ref="songItem"
              class="songItem"
              v-bind:key="index"
              v-for="(song, index) in songsData"
              @click="onSongClick(song)"
            >
              <Song :songData="song" :index="index + 1"></Song>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="guessLove" v-if="songsData.length === PlayListDetail?.trackCount"></div>
          <div class="back" @click="onClose">返回</div>
        </div>
        <div
          class="bottomLoading"
          ref="loadingMoreSong"
          :class="songsData.length === PlayListDetail?.trackCount ? '' : 'active'"
        >
          <div class="dian">加</div>
          <div class="dian">载</div>
          <div class="dian">中</div>
        </div>
      </div>
    </n-drawer>
  </div>
</template>
<style lang="less" scoped>
#loading {
  width: 100vw;
  height: 100vh;
  text-align: center;
  line-height: 100vh;
  font-size: 32px;
  background-color: #fff;
}

#drawer {
  .header {
    height: 43vh;
    background-color: #25141cd3;
    border-radius: 10px 10px 0px 0;
    color: #fff;
    padding-top: 20px;
    overflow-x: hidden;
    .topBar {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .drawerLeft {
        display: flex;
        justify-content: center;
        align-items: center;
        .leftsanjiao {
          margin-left: 10px;
        }
        .label {
          margin-left: 10px;
        }
      }
      .right {
        display: flex;
        justify-content: center;
        align-items: center;
        .sousuo2 {
          width: 26px;
          height: 26px;
          margin-right: 8px;
        }
        .sandian {
          width: 50px;
          height: 40px;
          margin-right: 4px;
          filter: invert(100%);
        }
      }
    }
    .center {
      display: flex;
      max-height: 40%;
      margin-top: 8px;
      padding: 10px;
      .left {
        width: 130px;
        height: 100px;
        text-align: center;
        img {
          width: 100px;
          height: 100px;
          object-fit: contain;
          border-radius: 10px;
        }
      }
      .right {
        margin-left: 12px;
        .top {
          display: flex;
          .label {
            font-size: 16px;
            margin-left: 6px;
          }
          .xiangxiasanjiaoxingIcon {
            --width: 0.4rem;
            --height: 0.4rem;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 0.48rem;
            margin-right: 0.4rem;
            margin-left: 0.2rem;
            padding-top: 0.06rem;
            position: relative;
            .background {
              width: var(--width);
              height: var(--height);
              background-color: #ffffff69;
              border-radius: 50%;
              position: absolute;
            }
            .xiangxiasanjiaoxing {
              width: calc(var(--width) / 1.6);
              height: calc(var(--height) / 1.6);
              filter: invert(100%);
            }
          }
        }
        .bottom {
          display: flex;
          margin-top: 0.2rem;
          margin-left: 0.12rem;
          .avatar {
            width: 0.4rem;
            height: 0.4rem;
            text-align: center;
            line-height: 0.4rem;
            background-color: #ffffffa5;
            padding-top: 0.04rem;
            border-radius: 50%;
          }
          .creater {
            margin: 0 0.16rem;
            font-size: 0.24rem;
            margin-left: 0.12rem;
            margin-top: 0.04rem;
          }
          .guanzhu {
            --width: 1.2rem;
            --height: 0.4rem;
            width: var(--width);
            height: var(--height);
            text-align: center;
            line-height: var(--height);
            color: #fff;
            // margin-left: 10px;
            margin-top: 0px;
            position: relative;
            .background {
              width: var(--width);
              height: var(--height);
              position: absolute;
              background-color: #ffffff35;
              border-radius: 10px;
              transition: all 0.4s;
            }
            .label {
              font-size: 12px;
            }
          }
          .guanzhu:hover .background {
            background-color: rgba(200, 72, 72, 0.679);
          }
        }
      }
    }
    .headerBottom {
      margin-top: 20px;
      .bottomTop {
        height: 40vh;
        width: 100%;
        height: 20px;
        overflow: hidden;
        font-size: 12px;
        margin-left: 10px;
        padding-right: 16px;
        .label {
          width: 100%;
          padding-left: 6px;
        }
      }
      .bottomBar {
        display: flex;
        justify-content: space-between;
        margin: 0 10px;
        margin-top: 10px;
        .bottomBox {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 29%;
          height: 40px;
          background-color: rgba(145, 140, 142, 0.247);
          border-radius: 30px;
          .icon {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
        }
        .booked {
          background-color: #ff2756;
        }
      }
    }
  }
  .content {
    background-color: #fff;
    .stickyTopBar {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      background-color: #fff;
      position: sticky;
      top: 0;
      .left {
        display: flex;
        justify-content: center;
        align-content: center;
        .background {
          width: 24px;
          height: 24px;
          background-color: #b52928;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 10px;
          margin-right: 16px;
          .bofang1 {
            width: 10px;
            height: 10px;
            margin-left: 2px;
            filter: invert(80%);
          }
        }
        .labelBox {
          .label {
            font-size: 16px;
          }
          .statisticSum {
            font-size: 14px;
            margin-left: 6px;
            filter: invert(40%);
          }
          .allCanPlay {
            font-size: 12px;
            filter: invert(40%);
          }
        }
      }
      .right {
        display: flex;
        justify-content: center;
        align-content: center;
        .xiazai1 {
          margin-right: 10px;
          width: 24px;
          height: 24px;
        }
        .playlistMusic4 {
          margin-left: 4px;
          margin-right: 10px;
          width: 24px;
          height: 24px;
        }
      }
    }
    .songs {
      .song {
        margin: 24px;
        margin-bottom: 0;
      }
    }
  }
  .bottom {
    .guessLove {
      height: 60px;
    }
    .back {
      position: fixed;
      right: 1rem;
      bottom: 2.8rem;
      font-size: 22px;
      background-color: #ff2756;
      border-radius: 6px;
    }
  }
  .bottomLoading.active {
    height: 30px;
    opacity: 1;
    display: block;
    overflow-x: hidden;
  }
  .bottomLoading {
    height: 30px;
    text-align: center;
    overflow-x: hidden;
    opacity: 0;
    display: none;
    transform: opacity 0.3s;
    position: relative;
    margin-left: 0.4rem;
    .dian {
      display: inline-block;
      transform: translateY(0px);
      animation-name: bottomLoading;
      animation-timing-function: ease-in;
      animation-duration: 1s;
      animation-fill-mode: both;
      animation-delay: 0s;
      animation-iteration-count: infinite;
      animation-direction: normal;
    }
    .dian:nth-of-type(1) {
      font-size: 18px;
      margin-right: 10px;
      animation-timing-function: ease-in;
    }
    .dian:nth-of-type(2) {
      font-size: 24px;
      margin-right: 20px;
      animation-timing-function: ease;
    }
    .dian:nth-of-type(3) {
      margin-right: 20px;
      font-size: 18px;
      animation-timing-function: ease-in;
    }
  }
}

@keyframes bottomLoading {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
