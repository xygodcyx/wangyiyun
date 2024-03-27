<template>
  <div class="testCom">
    <audio ref="testAudio" :src="testSrc"></audio>
    <button @click="testAudio.play()">播放</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import request from '@/request/';
const { getSongUrlNew } = request;
const testSrc = ref('');
const testAudio = ref();
onMounted(async () => {
  const data = (await getSongUrlNew(33894312)).data.data[0];
  console.log(data);
  testSrc.value = data.url;
});
</script>

<style scoped></style>
