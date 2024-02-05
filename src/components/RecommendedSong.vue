<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, ref } from 'vue';
import type { RecommendedSongType } from '../unit';
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
    type: Object as () => RecommendedSongType,
    default: {}
  }
});
// const playSum = ref();

const unit = ref('');

const playSum = computed(() => {
  return formattingUnit(props.recommendedSongData.playCount);
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
const formattingName = (name: string, length: number = 13) => {
  if (name?.length > length) {
    name = name.substring(0, length);
    name += '...';
  }
  return name;
};
const formattingUnit = (number: number) => {
  if (number >= 1000000000000) {
    unit.value = '兆';
    number = parseFloat((number / 1000000000000).toFixed(1));
  } else if (number >= 100000000) {
    unit.value = '亿';
    number = parseFloat((number / 100000000).toFixed(1));
  } else if (number >= 10000) {
    unit.value = '万';
    number = parseFloat((number / 10000).toFixed(1));
  } else {
    unit.value = '';
  }
  return number;
};

//歌单详细
const active = ref(false);
const placement = ref('bottom');
const onPlayListClick = () => {
  // placement.value = 'bottom';
  active.value = true;
  console.log(placement.value);
  window.addEventListener('popstate', closeModalOnBackButton);
};
const onClose = () => {
  // placement.value = 'top';
  active.value = false;
  console.log(placement.value);
  window.removeEventListener('popstate', closeModalOnBackButton);
};

// 返回键触发的关闭模态框操作
function closeModalOnBackButton(event: Event) {
  // 如果是返回键触发的事件
  if (event && event.type === 'popstate') {
    event.preventDefault();
    // 关闭模态框的逻辑
    onClose();
  }
}
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
  <n-drawer
    v-model:show="active"
    :placement="placement"
    style="width: 100vw; height: 100vh"
    id="drawer"
  >
    <div class="header">
      <div class="topBar">
        <div class="left">
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
      <div class="center">本歌单id:{{ recommendedSongData.id }}</div>
    </div>
    <div class="content">
      <div class="stickyTopBar">
        <div class="left">
          <div class="background">
            <svg class="icon bofang1" aria-hidden="true">
              <use xlink:href="#icon-bofang1"></use>
            </svg>
          </div>
          <div class="labelBox">
            <span class="label">播放全部</span>
            <span class="statisticSum">(123)</span>
          </div>
        </div>
        <div class="right">
          <svg class="icon xiazai1" aria-hidden="true">
            <use xlink:href="#icon-xiazai1"></use>
          </svg>
          <svg class="icon playlistMusic4" aria-hidden="true">
            <use xlink:href="#icon-24gl-playlistMusic4"></use>
          </svg>
        </div>
      </div>
    </div>
  </n-drawer>
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
#drawer {
  .header {
    height: 30vh;
    background-color: #25141cd3;
    border-radius: 10px 10px 0px 0;
    color: #fff;
    padding-top: 20px;
    .topBar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
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
            font-size: 18px;
          }
          .statisticSum {
            font-size: 14px;
            margin-left: 6px;
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
        }
        .playlistMusic4 {
          margin-left: 10px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
