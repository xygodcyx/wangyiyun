<script setup lang="ts"></script>
<template>
  <div class="randomSong" id="randomSong">
    <div class="songImg">
      <img src="http://p1.music.126.net/RCoEE3DCOsxQ-rQ60GvbwQ==/109951169300706689.jpg" alt="" />
    </div>
    <div class="description">
      <div class="label">乌兰巴托的夜|2023</div>
      <div class="tagAndName">
        <div class="tag">超71%播放</div>
        <div class="name">
          <n-ellipsis style="max-width: 170px">我支持晚饭_李雨菲我支持晚饭_李雨菲</n-ellipsis>
        </div>
      </div>
    </div>

    <div class="rightPlayIcon">
      <svg class="icon bofang" aria-hidden="true">
        <use xlink:href="#icon-bofang1"></use>
      </svg>
    </div>
  </div>
</template>
<style lang="less" scoped>
#randomSong.randomSong {
  display: flex;
  width: 100%;
  height: 60px;
  .songImg {
    width: 64px;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
    }
  }
  .description {
    width: 80%;
    padding-left: 10px;
    padding-top: 8px;
    height: 100%;
    display: flex;
    flex-direction: column;
    cursor: default;
    .label {
      font-weight: 600;
    }
    .tagAndName {
      width: 230px;
      margin-top: 4px;
      display: flex;
      .tag {
        //   width: 60px;
        padding-left: 2px;
        padding-right: 2px;
        height: 18px;
        line-height: 20px;
        font-size: 10px;
        text-align: center;
        color: #fe5554;
        background-color: #f6e7e7;
        border-radius: 6px;
        font-weight: bold;
      }
      .name {
        width: 170px;
        font-size: 12px;
        margin-left: 6px;
        color: #959ca7;
      }
    }
  }
  .rightPlayIcon {
    width: 20px;
    height: 20px;
    border-radius: 30%;
    border: 1px solid #959ca7;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
    padding-left: 2px;
    .bofang {
      width: 10px;
      height: 10px;
      color: #959ca7;
      filter: invert(60%);
      cursor: pointer;
    }
  }
}
</style>
