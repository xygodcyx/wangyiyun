<script setup lang="ts"></script>
<template>
  <div class="randomPlaylist" id="randomPlaylist">
    <div class="topBar">
      <div class="left">
        <svg class="icon shuaxin" aria-hidden="true">
          <use xlink:href="#icon-shuaxin"></use>
        </svg>
        <div class="label">根据 | 青柠 | 推荐</div>
        <div class="playBtn">
          <svg class="icon yousanjiao" aria-hidden="true">
            <use xlink:href="#icon-bofang1"></use>
          </svg>
          <div class="label">播放</div>
        </div>
      </div>
      <div class="right">
        <svg class="icon gengduo" aria-hidden="true">
          <use xlink:href="#icon-gengduo1"></use>
        </svg>
      </div>
    </div>
    <div class="randomSongs">
      <n-carousel :space-between="20" :loop="false" draggable>
        <div class="randomSongWrap">
          <div class="randomSongItem">
            <RandomSong></RandomSong>
          </div>
          <div class="randomSongItem">
            <RandomSong></RandomSong>
          </div>
          <div class="randomSongItem">
            <RandomSong></RandomSong>
          </div>
        </div>
        <div class="randomSongWrap">
          <div class="randomSongItem">
            <RandomSong></RandomSong>
          </div>
          <div class="randomSongItem">
            <RandomSong></RandomSong>
          </div>
          <div class="randomSongItem">
            <RandomSong></RandomSong>
          </div>
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
#randomPlaylist.randomPlaylist {
  margin-top: 0.26rem;

  .topBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.2rem;

    .left {
      display: flex;
      justify-content: center;
      align-items: center;

      .shuaxin {
        width: 20px;
        height: 20px;
        margin-right: 10px;
        margin-bottom: 4px;
        cursor: pointer;
      }

      .label {
        font-size: 0.32rem;
        font-weight: bold;
        color: #444c5e;
      }

      .playBtn:hover {
        background-color: #bac9e0;
      }

      .playBtn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 20px;
        line-height: 20px;
        background-color: #e9ecf1;
        border-radius: 10px;
        margin-left: 10px;
        cursor: pointer;
        transition: background-color 0.3s;

        .yousanjiao {
          width: 0.22rem;
          height: 0.22rem;
          margin-right: 2px;
          margin-bottom: 1px;
          filter: invert(0%);
        }

        .label {
          font-size: 12px;
        }
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

  .randomSongs {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .randomSongWrap {
      .randomSongItem {
        margin-bottom: 10px;
      }
    }

    .custom-dots {
      display: flex;
      margin: 0;
      padding: 0;
      margin-top: 2px;
      margin-left: 40%;

      // position: absolute;
      // bottom: 0px;
      // left: 40%;
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
