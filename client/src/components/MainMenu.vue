<template>
  <div class="mainMenu" id="mainMenu">
    <n-carousel :slides-per-view="1" :loop="false" draggable>
      <div class="onePage page">
        <div v-bind:key="index" v-for="(item, index) in onePageMenuItems" class="mainMenuItem">
          <div class="svgIcon">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="item.svgUrl"></use>
            </svg>
          </div>
          <div class="label">{{ item.label }}</div>
        </div>
      </div>
      <div class="twoPage page">
        <div v-bind:key="index" v-for="(item, index) in twoPageMenuItems" class="mainMenuItem">
          <div class="svgIcon">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="item.svgUrl"></use>
            </svg>
          </div>
          <div class="label">{{ item.label }}</div>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
type mainMenuItemType = {
  label: string;
  svgUrl: string;
  toUrl: string;
};
const onePageMenuItems = ref<mainMenuItemType[]>([
  { label: '每日推荐', svgUrl: '#icon-mrtj', toUrl: '#' },
  { label: '私人漫游', svgUrl: '#icon-diantai', toUrl: '#' },
  { label: '歌单', svgUrl: '#icon-bofanggedan', toUrl: '#' },
  { label: '排行榜', svgUrl: '#icon-paihangbang', toUrl: '#' },
  { label: '有声书', svgUrl: '#icon-shiwu-shu', toUrl: '#' }
]);
const twoPageMenuItems = ref<mainMenuItemType[]>([
  { label: '数字专辑', svgUrl: '#icon-shuzizhuanji', toUrl: '#' },
  { label: '关注新歌', svgUrl: '#icon-guanzhuxinge', toUrl: '#' },
  { label: '秒时', svgUrl: '#icon--stack-music', toUrl: '#' },
  { label: '收藏家', svgUrl: '#icon-paimaichuizi', toUrl: '#' },
  { label: '歌房', svgUrl: '#icon-gefang', toUrl: '#' }
]);
</script>

<style lang="less" scoped>
#mainMenu.mainMenu {
  margin-top: 0.16rem;
  padding: 0.04rem;
  .page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .mainMenuItem {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .svgIcon {
      }
      .label {
        font-size: 0.24rem;
        opacity: 0.8;
        color: #828a96;
      }
    }
  }

  .custom-dots {
    display: flex;
    margin: 0;
    margin-top: 0.28rem;
    margin-left: 40%;
    padding: 0;
    // position: absolute;
    // bottom: 0;
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
</style>
