<template>
  <div id="alertBox" class="alertBox">
    <div class="background" :class="type"></div>
    <div class="title" :class="type">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'title'
  },
  // content: {
  //   type: String,
  //   default: 'content'
  // },
  // btnText: {
  //   type: String,
  //   default: 'close'
  // },
  type: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'warn', 'success', 'danger'].includes(value)
  },
  duration: {
    type: Number,
    default: 500
  },
  close: Function
});
</script>

<style lang="less" scoped>
.primary {
  background-color: rgb(121, 196, 237);
  border-radius: 2px;

  color: #fff;
}
.warn {
  background-color: rgb(240, 199, 77);
  border-radius: 2px;
  color: #333;
}
.success {
  background-color: rgb(105, 231, 126);
  border-radius: 2px;
  color: #fff;
}
.danger {
  background-color: rgb(240, 87, 87);
  border-radius: 2px;
  color: #fff;
}
#alertBox.alertBox {
  position: fixed;
  width: 200px;
  height: 40px;
  top: 20px;
  left: 50%;
  transform: translate(-50%);
  text-align: center;
  overflow: hidden;
  z-index: 999999999;
  .title {
    font-size: 16px;
  }
}
</style>
