<template>
  <div class="yuyin" @click="showModal">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-yuyin"></use>
    </svg>
    <div v-show="!canClickYuYin" class="timer_label">{{ toggleInterval - toggleTimer }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  useSpeechRecognition,
  useSpeechSynthesis,
  useEyeDropper,
  useDevicesList,
  useUserMedia
} from '@vueuse/core';
import DialogBox from './DialogBox';
const {
  isSupported: isSupportedSpeechRec,
  isListening: isListeningSpeechRec,
  isFinal: isFinalSpeechRec,
  result: resultSpeechRec,
  start: speechRecStart,
  stop: speechRecStop
} = useSpeechRecognition({
  lang: 'cmn-Hans-CH'
});

//显示询问框
const showModal = () => {
  if (!canClickYuYin.value) return;
  DialogBox.show(
    {
      title: `开启语音识别(当前状态:${currStatus.value})`,
      content: '开启后可以用语音操控哦',
      footer: 'eg:播放、暂停、播放xxx',
      cancelStr: '算了',
      confirmStr: `${isListeningSpeechRec.value ? '关闭' : '可以'}`
    },
    () => {
      console.log('cancel');
    },
    () => {
      console.log('confirm');
      onStartListingConfirm();
    }
  );
};

const toggleInterval = ref(10);
const toggleTimer = ref(0);
let toggleIntervalTimer = null;
const currStatus = ref('关闭');
const onStartListingConfirm = () => {
  if (!canClickYuYin.value) return;
  startListening();
};
watch(
  () => resultSpeechRec.value,
  (result) => {
    console.log(result);
  },
  {
    immediate: true
  }
);
console.log(resultSpeechRec.value);
watch(
  () => isListeningSpeechRec.value,
  (isListening) => {
    console.log('isListening', isListening);
    if (isListening) {
      currStatus.value = '开启';
    } else {
      currStatus.value = '关闭';
    }
  }
);
const canClickYuYin = ref(true);
const startListening = () => {
  if (isListeningSpeechRec.value) {
    speechRecStop();
    canClickYuYin.value = false;
    toggleIntervalTimer = setInterval(() => {
      if (toggleTimer.value >= toggleInterval.value) {
        canClickYuYin.value = true;
        toggleTimer.value = 0;
        clearInterval(toggleIntervalTimer);
      }
      toggleTimer.value++;
      console.log(1);
    }, 1000);
  } else {
    speechRecStart();
  }
};
speechRecStart();
</script>

<style lang="less" scoped>
.yuyin {
  .icon {
    filter: saturate(30%);
  }
  position: relative;
  .timer_label {
    position: absolute;
    width: 34px;
    height: 34px;
    top: 0px;
    left: 0px;
    font-size: 18px;
    line-height: 34px;
    text-align: center;
    border-radius: 20px;
    background-color: antiquewhite;
  }
}
</style>
