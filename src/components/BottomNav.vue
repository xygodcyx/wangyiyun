<template>
  <div class="bottomNav" id="bottomNav">
    <div
      class="bottomNavItem"
      @click="bottomNavItemActiveIndex = index"
      v-bind:key="index"
      :class="bottomNavItemActiveIndex == index ? 'active' : ''"
      v-for="(item, index) in bottomNav"
    >
      <div class="bottomNavItemLabel">
        <div class="background">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="item.svgUrl"></use>
          </svg>
        </div>
        <span class="label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type bottomLabelType = {
  label: string;
  svgUrl: string;
};
import { ref } from 'vue';
const bottomNavItemActiveIndex = defineModel({
  default: 0
});
const bottomNav = ref<bottomLabelType[]>([
  {
    label: '发现',
    svgUrl: '#icon-logo-dark'
  },
  {
    label: '我的',
    svgUrl: '#icon-yinle'
  },
  {
    label: '关注',
    svgUrl: '#icon-guanzhu1'
  }
]);
</script>

<style lang="less" scoped>
#bottomNav.bottomNav {
  position: fixed;
  width: 100%;
  height: 1.2rem;
  display: flex;
  padding: 0.2rem;
  margin: 0 auto;
  justify-content: space-around;
  align-items: center;
  bottom: 0;
  z-index: 999;
  background-color: #ffffff;
  .bottomNavItem:hover {
    // opacity: 0.5;
    color: aqua;
  }
  .bottomNavItem.active .label {
    color: #c20c0c7e;
  }
  .bottomNavItem.active .background::after {
    content: '';
    background-color: #c20c0c !important; /* 设置覆盖背景的颜色 */
  }
  .bottomNavItem {
    font-size: 0.4rem;
    cursor: pointer;
    .bottomNavItemLabel {
      display: flex;
      flex-direction: column;
      align-items: center;
      .background {
        position: relative;
        width: 0.6rem;
        height: 0.6rem;
        text-align: center;
        line-height: 0.6rem;
      }
      .background::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #c20c0c71; /* 设置覆盖背景的颜色 */
        z-index: -1; /* 确保覆盖在元素后面 */
      }
      .label {
        font-size: 0.24rem;
      }
    }
  }
}
</style>
