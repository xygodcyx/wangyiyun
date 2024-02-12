<script setup lang="ts">
import type { TTrackType } from '@/type';
import { onMounted, ref } from 'vue';
const props = defineProps({
  songData: {
    type: Object as () => TTrackType,
    default: {}
  },
  index: {
    type: Number,
    default: 1
  }
});
onMounted(() => {});
//播放歌曲
</script>
<template>
  <div class="song" :class="songData.fee === 1 ? 'noPlay' : ''">
    <div class="left">
      <div class="label">{{ index }}</div>
      <div class="detail">
        <div class="name">
          <n-ellipsis :line-clamp="1">
            {{ songData?.name }}
          </n-ellipsis>
        </div>
        <div class="author">
          <n-ellipsis :line-clamp="1">
            <span v-bind:key="index" v-for="(author, index) in songData?.ar">{{
              index == songData!.ar.length - 1 ? author.name : author.name + '/'
            }}</span>
          </n-ellipsis>
        </div>
      </div>
    </div>
    <div class="right">
      <svg class="icon sandian" aria-hidden="true">
        <use xlink:href="#icon-sandian"></use>
      </svg>
    </div>
  </div>
</template>
<style lang="less" scoped>
.song.noPlay {
  opacity: 0.3;
}
.song {
  width: 90%;
  min-height: 60px;
  max-height: 80px;
  display: flex;
  .left {
    width: 100%;
    display: flex;
    justify-content: space-around;
    //     border: 1px solid red;
    .label {
      width: 30px;
      display: flex;
      align-items: center;
    }
    .detail {
      width: 100%;
      display: flex;
      margin-left: 10px;
      flex-direction: column;
      justify-content: center;
      .name {
        color: #000;
        font-size: 16px;
      }
      .author {
        color: #0000007a;
        font-size: 14px;
      }
    }
  }
  .right {
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    .sandian {
      right: 0;
      position: absolute;
      filter: invert(30%);
    }
  }
}
</style>
