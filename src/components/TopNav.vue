<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
const topNavClass = ref('');
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
const handleScroll = () => {
  // 获取滚动条的滚动高度
  const scrollTop = window.scrollY;
  if (scrollTop >= 70) {
    topNavClass.value = 'active';
  } else {
    topNavClass.value = '';
  }
};
</script>
<template>
  <div class="topNav" :class="topNavClass" id="topNav">
    <div class="topNavBackground"></div>
    <div class="topNavLeft">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-santiao"></use>
      </svg>
    </div>
    <div class="topNavCenter">
      <InputBox></InputBox>
    </div>
    <div class="topNavRight">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-yuyin"></use>
      </svg>
    </div>
  </div>
</template>
<style lang="less" scoped>
#topNav.topNav.active {
  top: 0px;
  filter: invert(100%);
}
#topNav.topNav {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 6px;
  z-index: 999;
  filter: invert(0%);
  transition: filter, background-color, top, 0.4s;
  .topNavBackground {
    width: 100vw;
    z-index: 9999;
    position: absolute;
    background: linear-gradient(#e9e5fc55, #e9e5fc00);
  }
  .topNavLeft {
    margin-top: 0.2rem;
    .icon {
      filter: saturate(30%);
    }
  }
  .topNavRight {
    margin-top: 0.2rem;
    .icon {
      filter: saturate(30%);
    }
  }
  .topNavCenter {
    font-size: 0.4rem;
    width: 230px;
    cursor: pointer;
    .inputBox {
      width: 100%;
      .input {
        width: 100%;
        height: 30px;
        margin: 0 auto;
        border-radius: 14px;
        text-indent: 30px;
        border: 1px solid #d8dbfa;
        line-height: 30px;
        outline: none;
        font-size: 14px;
        background: linear-gradient(to right, #d8dbfa47, #f3d7ee57);
      }
      .input::placeholder {
        font-size: 12px;
        height: 30px;
        line-height: 30px;
        opacity: 0.8;
        top: 0.16rem;
        position: absolute;
      }
      .icon {
        width: 16px;
        height: 16px;
      }
      .sousuo {
        width: 14px;
        height: 14px;
        top: 0.22rem;
        left: 0.2rem;
      }
      .saoyisao {
        top: 0.2rem;
        right: 0.16rem;
      }
    }
  }
}
</style>
