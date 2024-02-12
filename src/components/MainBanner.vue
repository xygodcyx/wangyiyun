<script setup lang="ts">
type bannerType = {
  pic: string;
  songId: number | null | undefined;
  typeTitle: string;
  url: string | null | undefined;
};
type bannerServerType = {
  pic: string;
  targetId: number | null | undefined;
  typeTitle: string;
  url: string | null | undefined;
};
import { getBanner } from '@/request/GetBanner';
import { ArrowBack, ArrowForward } from '@vicons/ionicons5';
import { onMounted, ref } from 'vue';
const bannersData = ref<bannerType[]>([]);
onMounted(async () => {
  await loadBanners();
});

const loadBanners = async (type: number = 1) => {
  const result = await getBanner(type);
  const banners: [] = result.data.banners;
  // console.table(banners);

  banners.map((banner: bannerServerType) => {
    bannersData.value.push({
      pic: banner.pic,
      songId: banner?.targetId,
      typeTitle: banner.typeTitle,
      url: banner?.url
    });
  });
};
</script>
<template>
  <div class="banner" id="banner">
    <n-carousel :space-between="20" show-arrow draggable autoplay>
      <div class="bannerItem" v-bind:key="index" v-for="(banner, index) in bannersData">
        <img class="carousel-img" :src="banner.pic" />
        <div class="typeTitle">
          {{ banner.typeTitle }}
        </div>
      </div>
      <template #arrow="{ prev, next }">
        <div class="custom-arrow">
          <button type="button" class="custom-arrow--left" @click="prev">
            <n-icon><ArrowBack /></n-icon>
          </button>
          <button type="button" class="custom-arrow--right" @click="next">
            <n-icon><ArrowForward /></n-icon>
          </button>
        </div>
      </template>
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
<style lang="less" scoped>
#banner.banner {
  margin-top: 8px;
  .bannerItem {
    .carousel-img {
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 0.2rem;
    }
    .typeTitle {
      width: 0.86rem;
      height: 0.3rem;
      background-color: #fff;
      color: #000000;
      text-align: center;
      line-height: 0.32rem;
      position: absolute;
      right: 0.08rem;
      bottom: 0.3rem;
      font-size: 0.2rem;
      border-radius: 0.08rem;
      cursor: pointer;
    }
  }
  .custom-arrow {
    display: flex;
    position: absolute;
    bottom: 25px;
    right: 10px;
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      margin-right: 12px;
      color: #fff;
      background-color: rgba(255, 255, 255, 0.1);
      border-width: 0;
      border-radius: 8px;
      transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    button:active {
      transform: scale(0.95);
      transform-origin: center;
    }
  }
  .custom-dots {
    display: flex;
    margin: 0;
    padding: 0;
    position: absolute;
    bottom: 20px;
    left: 20px;
    li {
      display: inline-block;
      width: 12px;
      height: 4px;
      margin: 0 3px;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.4);
      transition:
        width 0.3s,
        background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    li.is-active {
      width: 40px;
      background: #fff;
    }
  }
}
</style>
