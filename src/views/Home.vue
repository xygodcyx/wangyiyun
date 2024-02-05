<script setup lang="ts">
// import AudioPlay from '@/components/AudioPlay.vue';
import BottomNav from '@/components/BottomNav.vue';
import TopNav from '@/components/TopNav.vue';
import { ref } from 'vue';
const bottomNavItemActiveIndex = ref(0);
</script>
<template>
  <!-- <div><AudioPlay></AudioPlay>;</div> -->
  <div class="Home">
    <div class="content">
      <div v-show="bottomNavItemActiveIndex == 0" class="contentItem myDiscover">
        <TopNav></TopNav>
        <div class="banner">
          <main-banner></main-banner>
        </div>
        <MainMenu></MainMenu>
        <RecommendedPlaylist></RecommendedPlaylist>
        <RandomPlaylist></RandomPlaylist>
      </div>
      <div v-show="bottomNavItemActiveIndex == 1" class="contentItem my">1</div>
      <div v-show="bottomNavItemActiveIndex == 2" class="contentItem cloudVillage">2</div>
    </div>
  </div>
  <BottomNav v-model="bottomNavItemActiveIndex"></BottomNav>
</template>
<style lang="less" scoped>
.Home {
  width: 100%;
  min-height: 160vh;
  background: linear-gradient(#e9e5fc82, #fff);
  .content {
    width: 100%;
    height: 100vh;
    .contentItem {
      width: 90%;
      height: 100%;
      margin: 0 auto;
      // background-color: antiquewhite;
    }
  }
}

::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #fffefb;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb {
  background-color: #b598a1;
  opacity: 0.3;
  border-radius: 5px;
}
@media screen and (max-width: 720px) {
  ::-webkit-scrollbar {
    width: 2px;
  }
  .content {
    display: flex;
    .article {
      width: 100%;
      .click_area {
        width: 80%;
        height: 80%;
        position: absolute;
        top: 10%;
        left: 10%;
        // background-color: red;
        z-index: 999;
      }
    }
  }
  .PC {
    display: none;
  }
  .phoneTopbar {
    display: block;
  }
}
@media screen and (min-width: 720px) and (max-width: 900px) {
  ::-webkit-scrollbar {
    width: 6px;
  }
  .content {
    display: flex;
    .article {
      width: 100%;
    }
  }
}
@media screen and (min-width: 720px) {
  .phoneTopbar {
    display: none;
  }
  .click_area {
    width: 95%;
    height: 95%;
    text-align: center;
    position: absolute;
    top: 5%;
    left: 5%;
    // background-color: red;
    z-index: 999;
  }
}
</style>
