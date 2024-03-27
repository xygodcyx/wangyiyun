<template>
  <div class="vueUseTest">
    <button @click="enabled = !enabled">{{ enabled ? 'stop' : 'start' }}</button>
    <video src="" ref="video" autoplay muted></video>
    <button
      @click="
        () => {
          open();
        }
      "
    >
      打开颜色提取
    </button>
    <div class="resultTest">
      <div class="label">识别结果:</div>
      <div class="result">
        {{ speechRecResult }}
        <button @click="speechRecStart" :disabled="isListeningSpeechRec">开始监听</button>
        ({{ isListeningSpeechRec ? 'isListening' : 'no' }}) ({{
          speechIsPlaying ? 'isPlaying' : 'no'
        }})
        <span :style="color">{{ sRGBHex }}</span>
      </div>
    </div>
    <input type="text" v-model="text" />
    <button @click="playSpeechSynthesis">播放</button>
  </div>
</template>

<script setup lang="ts">
import {
  useSpeechRecognition,
  useSpeechSynthesis,
  useEyeDropper,
  useDevicesList,
  useUserMedia
} from '@vueuse/core';
import { ref, watch, onMounted, watchEffect, computed } from 'vue';
//颜色提取start
const { open, sRGBHex } = useEyeDropper();
sRGBHex.value = '#cccccc';
const color = ref({
  color: sRGBHex
});
//颜色提取end

//语音识别start
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
if (!isSupportedSpeechRec) {
  alert('您的浏览器不支持语音识别！');
} else {
  console.log('支持语音识别！');
}
const speechRecResult = ref('');
let lastCharIndex = ref(0);
watch(resultSpeechRec, (result) => {
  speechRecResult.value = result.slice(lastCharIndex.value);
});
watch(
  isFinalSpeechRec,
  (result) => {
    if (result) {
      lastCharIndex.value = resultSpeechRec.value.length;
      text.value = speechRecResult.value;
    }
  },
  {
    immediate: true
  }
);

//语音识别end

//语音合成start
const voice = ref<SpeechSynthesisVoice>(undefined as unknown as SpeechSynthesisVoice);
const text = ref('hello');
const pitch = ref(1);
const rate = ref(1);
const speech = useSpeechSynthesis(text, {
  lang: 'cmn-Hans-CH',
  voice,
  pitch,
  rate
});
let synth: SpeechSynthesis;
const voices = ref<SpeechSynthesisVoice[]>([]);
const speechIsPlaying = ref(false);
watch(
  speech.status,
  (result) => {
    if (result === 'init') {
      console.log('init');
      speechIsPlaying.value = false;
    } else if (result === 'play') {
      console.log('play');
      speechIsPlaying.value = true;
    } else if (result === 'end') {
      console.log('end');
      speechIsPlaying.value = false;
      speechRecResult.value = '';
      text.value = '';
    }
  },
  {
    immediate: true
  }
);
watch(speech.error, (result) => {
  console.log(result);
  stopSpeechSynthesis();
});
onMounted(() => {
  //语音合成
  if (speech.isSupported.value) {
    // load at last
    setTimeout(() => {
      synth = window.speechSynthesis;
      voices.value = synth.getVoices();
      voice.value = voices.value[0];
    }, 100);
  }
});

function playSpeechSynthesis() {
  try {
    if (speech.status.value === 'pause') {
      window.speechSynthesis.resume();
    } else {
      speech.speak();
    }
  } catch (e) {
    console.log(e);
  }
}

function pauseSpeechSynthesis() {
  window.speechSynthesis.pause();
}

function stopSpeechSynthesis() {
  speech.stop();
}
//语音合成end

//媒体start

const currentCamera = ref<string>();
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    currentCamera.value = cameras.value[0]?.deviceId;
  }
});

const video = ref<HTMLVideoElement>();
const { stream, enabled } = useUserMedia({
  constraints: { video: { deviceId: currentCamera.value } }
});

watchEffect(() => {
  if (video.value) video.value.srcObject = stream.value!;
});

//媒体end
</script>

<style lang="less" scoped>
.vueUseTest {
  width: 600px;
  height: 300px;
  margin: 0 auto;
  margin-top: 100px;
  border: 1px solid rgb(174, 211, 243);
  .testBtn:hover {
    background-color: rgb(180, 217, 250);
  }
  .testBtn:active {
    background-color: rgb(51, 89, 122);
    box-shadow: 0px 1px rgb(34, 56, 75);
  }
  .testBtn {
    width: 200px;
    height: 40px;
    margin: 0 auto;
    margin-top: 10px;
    display: block;
    border: 1px solid aliceblue;
    outline: none;
    border-radius: 10px;
    transition: background-color 0.1s;
    cursor: pointer;
  }
  .resultTest {
    width: 400px;
    height: 220px;
    border: 1px solid rgb(152, 177, 200);
    margin: 0 auto;
    margin-top: 10px;
    padding: 6px;
  }
}
</style>
