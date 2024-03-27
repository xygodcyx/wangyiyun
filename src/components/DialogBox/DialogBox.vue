<template>
  <div id="dialogBox" class="dialogBox">
    <div class="warp">
      <div class="title">{{ title }}</div>
      <div class="content">{{ content }}</div>
      <div class="footer">{{ footer }}</div>
      <div class="buttons">
        <div @click="cancel()" class="cancel btn">
          {{ cancelStr }}
        </div>
        <div @click="confirm()" class="confirm btn">
          {{ confirmStr }}
        </div>
      </div>
    </div>
  </div>
  <div @click.prevent="" class="modal"></div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'title'
  },
  content: {
    type: String,
    default: 'content'
  },
  footer: {
    type: String,
    default: ''
  },
  cancelStr: {
    type: String,
    default: 'cancel'
  },
  confirmStr: {
    type: String,
    default: 'confirm'
  },
  cancel: {
    type: Function,
    default: () => {}
  },
  confirm: {
    type: Function,
    default: () => {}
  }
});
</script>

<style lang="less" scoped>
#dialogBox.dialogBox {
  position: absolute;
  width: 230px;
  height: 130px;
  padding: 10px;
  background-color: rgba(246, 243, 243, 0.951);
  border-radius: 6px;
  top: 200px;
  left: calc(50% - 110px);
  z-index: 99999;
  .warp {
    width: 90%;
    height: 90%;
    margin: 0 auto;
    .title {
      margin: 0 auto;
      font-size: 14px;
    }
    .content {
      margin-top: 6px;
    }
    .footer {
      min-height: 10px;
      margin-top: 10px;
      font-size: 12px;
    }
    .buttons {
      width: 100%;
      display: flex;
      justify-content: space-around;
      margin-top: 4px;
      .btn {
        min-width: 60px;
        text-align: center;
        height: 20px;
        line-height: 20px;
        border-radius: 10px;
        font-size: 14px;
      }
      .cancel {
        background-color: wheat;
      }
      .confirm {
        background-color: rgb(171, 243, 171);
      }
    }
  }
}
.modal {
  width: 1000vw;
  height: 1000vh;
  background-color: rgba(0, 0, 0, 0.378);
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 9999;
}
</style>
