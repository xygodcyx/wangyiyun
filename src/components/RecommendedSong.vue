<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, ref } from 'vue';

import PlaylistDetail from './PlaylistDetail.vue';
import type { TRecommendedSongType } from '@/type'; //歌单动态详细页的类型
import { formattingName, formattingUnit } from '@/Func/index';

//pinia
import { useGlobalVarStore } from '@/stores/GlobalVar';
const GlobalVar = useGlobalVarStore();
const props = defineProps({
  noPlayIcon: {
    type: Boolean,
    default: false
  },
  noRightTopStatisticData: {
    type: Boolean,
    default: false
  },
  recommendedSongData: {
    type: Object as () => TRecommendedSongType,
    default: {}
  }
});
// const playSum = ref();

//单位
const unit = computed(() => {
  return formattingUnit(props.recommendedSongData.playCount).unit;
});

const playSum = computed(() => {
  return formattingUnit(props.recommendedSongData.playCount).number;
});
const label = computed(() => {
  let length = props.recommendedSongData.highQuality ? 8 : 12;
  return formattingName(props.recommendedSongData.name, length);
});
const labelStyle = computed(() => {
  return {
    'text-indent': `${props.recommendedSongData.highQuality ? '60px' : '0px'}`
  };
});

//歌单详细
const active = ref(false);
const placement = ref('bottom');
const onPlayListClick = () => {
  active.value = true;
  GlobalVar.songPlayClass.push('inPlayListBefore');
};
</script>
<template>
  <div class="playList" id="playList" @click="onPlayListClick">
    <div class="card">
      <div class="cover">
        <img :src="recommendedSongData.picUrl" alt="" />
      </div>
      <div class="rigTopIcon">
        <div v-if="!noRightTopStatisticData" class="statisticData">
          <svg class="icon bofangStatistic" aria-hidden="true">
            <use xlink:href="#icon-bofang2"></use>
          </svg>
          <span class="statisticDataLabel"> {{ playSum }}{{ unit }} </span>
        </div>
        <svg v-else class="icon fuhao_wuxian absolute" aria-hidden="true">
          <use xlink:href="#icon-fuhao_wuxian"></use>
        </svg>
      </div>
      <div class="rigBottomIcon" v-show="!noPlayIcon">
        <svg class="icon bofang2 absolute" aria-hidden="true">
          <use xlink:href="#icon-bofang2"></use>
        </svg>
      </div>
    </div>
    <div class="bottomLabel">
      <div class="tag" v-show="recommendedSongData.highQuality">根据常听推荐</div>
      <p class="label" :style="labelStyle">{{ label }}</p>
    </div>
  </div>
  <PlaylistDetail
    v-model:active="active"
    v-model:placement="placement"
    :recommendedSongDataId="recommendedSongData.id"
  ></PlaylistDetail>
</template>
<style lang="less" scoped>
#playList.playList {
  width: 2rem;
  height: 3.04rem;
  margin-right: 0.24rem;
  .card {
    position: relative;
    width: 100px;
    height: 100px;
    cursor: pointer;
    .cover {
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0.2rem;
      }
    }
    .rigTopIcon {
      .fuhao_wuxian {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        top: 0.04rem;
        right: 0.2rem;
        z-index: 999;
        color: #fff;
        fill: #fff;
      }
      .statisticData {
        width: 1rem;
        position: absolute;
        color: #fff;
        top: 0.08rem;
        right: 0.46rem;
        font-size: 0.24rem;
        white-space: nowrap;
        text-align: right;
        .bofangStatistic {
          display: inline-block; //如果有元素需要跟着可变数据移动,不要用绝对定位   ps:如果需要换行元素，还是需要绝对定位，然后用text-indent来移动(需要用代码动态控制移动的px大小)
          width: 0.24rem;
          height: 0.24rem;
          z-index: 999;
          filter: invert(100%);
        }
        .statisticDataLabel {
          font-weight: bold;
          margin-left: 0.06rem;
        }
      }
    }
    .rigBottomIcon {
      .bofang2 {
        position: absolute;
        width: 0.6rem;
        height: 0.6rem;
        bottom: 0.1rem;
        right: 0.1rem;
        z-index: 999;
        filter: invert(100%);
      }
    }
  }

  .bottomLabel {
    position: relative;
    width: 2rem;
    .tag {
      height: 16px;
      background-color: #25141cd3;
      border-radius: 10px;
      line-height: 18px;
      margin-top: 4px;
      text-align: center;
      color: #b52928;
      font-size: 9.2px;
      float: left;
    }
    .label {
      width: 100px;
      text-indent: 62px;
      position: absolute;
      font-size: 14px;
    }
  }
}
</style>
