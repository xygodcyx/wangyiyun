<template>
    <div class="lyr">
        <!-- <audio ref="audio" @timeupdate="setOffset" controls src="../../public/testmusic/music.mp3"></audio> -->
        <div ref="container" class="lyr_container">
            <ul ref="ul" class="lrc-list">
                <li class="lrc-item" v-for="(lrc, index) in lrcData" :key="index">
                    {{ lrc.words }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUpdate, onMounted, ref, watch } from 'vue'
import { useSongManger } from '@/stores/SongManager';
import type { TSongLyric } from '@/type';
import { getSongLyric } from '@/request/GetSongLyric';
const SongManager = useSongManger()
const lrc = ref<TSongLyric>()

watch(() => SongManager.nowSong.id, () => {
    getSongLyricWhenSongIdChange()
})

watch(() => SongManager.curTime, () => {
    setOffset()
})

const getSongLyricWhenSongIdChange = async () => {
    console.log("nowSong.id ", SongManager.nowSong.id)
    const result = await getSongLyric(SongManager.nowSong.id)
    if (result.data.uncollected != null) {
        var obj = {
            time: 999999999,
            words: "未获取到歌词,欢迎您提供第一份歌词",
        };
        lrcData.value.push(obj)
        await nextTick(() => {
            if (!container.value || !ul.value || !ul.value!.children[0]) return
            containerHeight.value = container.value!.clientHeight;
            liHeight.value = ul.value!.children[0].clientHeight;
            maxOffset.value = ul.value!.clientHeight - containerHeight.value;
        })
        return
    }
    lrc.value = result.data
    // createLrcElements();
    console.log("歌词信息", result.data)
    lrcData.value = parseLrc()
    console.log("格式化后的歌词信息 ", lrcData)

    await nextTick(() => {
        if (!container.value || !ul.value || !ul.value!.children[0]) return
        containerHeight.value = container.value!.clientHeight;
        liHeight.value = ul.value!.children[0].clientHeight;
        maxOffset.value = ul.value!.clientHeight - containerHeight.value;
    })
}


onMounted(async () => {
    await getSongLyricWhenSongIdChange()
});
// onBeforeUpdate(() => {
//     getSongLyricWhenSongIdChange()
// })
type lrcItem = {
    time: number;
    words: string;
}
const lrcData = ref<Array<lrcItem>>([])
// const audio = ref()!
const ul = ref<HTMLUListElement>()!
const container = ref<HTMLDivElement>()!
// 容器高度
const containerHeight = ref();
// 每个 li 的高度
const liHeight = ref();
// 最大偏移量
const maxOffset = ref();


const parseTime = (timeStr: String) => {
    var parts = timeStr.split(':');
    return +parts[0] * 60 + +parts[1];
}

const parseLrc = (): Array<lrcItem> => {
    if (!lrc.value || !lrc.value.lrc) {
        return [{
            time: 999999,
            words: "未获取到歌词"
        }]
    }
    var lines = lrc.value.lrc.lyric.split('\n');
    lines = lines.filter((l) => l !== "")
    var result = []; // 歌词对象数组
    for (var i = 0; i < lines.length; i++) {
        var str = lines[i];
        var parts = str.split(']');
        var timeStr = parts[0].substring(1);
        var obj: lrcItem = {
            time: parseTime(timeStr),
            words: parts[1],
        };
        result.push(obj);
    }
    if (lrc.value.lyricUser) {
        var obj = {
            time: 999999999,
            words: `感谢: ${lrc.value.lyricUser.nickname} 提供的歌词`,
        };
        result.push(obj);
        const date = new Date(lrc.value.lyricUser.uptime)
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDay();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();
        var obj2 = {
            time: 9999999999,
            words: `最近一次更新在:${year}年${month}月${day}日${hour}时${min}分${sec}秒`,
        };
        result.push(obj2);
    }
    if (result.length === 0) {
        result.push({
            time: 9999999999,
            words: "未获取到歌词"
        })
    }
    return result;
}

function findIndex() {
    if (!lrcData.value) return
    // 播放器当前时间
    // var curTime = audio.value!.currentTime;
    var curTime = SongManager.curTime
    for (var i = 0; i < lrcData.value.length; i++) {
        if (curTime < lrcData.value[i].time) {
            return i - 1;
        }
    }
    // 找遍了都没找到（说明播放到最后一句）
    return lrcData.value.length - 1;
}

const setOffset = () => {
    var index = findIndex()!;
    var offset = liHeight.value * index + liHeight.value / 2 - containerHeight.value / 2;
    if (offset < 0) {
        offset = 0;
    }
    if (offset > maxOffset.value) {
        offset = maxOffset.value;
    }
    ul.value!.style.transform = `translateY(-${offset}px)`;
    // 去掉之前的 active 样式
    var li = ul.value!.querySelector('.active');
    if (li) {
        li.classList.remove('active');
    }

    li = ul.value!.children[index];
    if (li) {
        li.classList.add('active');
    }
}

</script>

<style lang="less">
.lyr {
    width: 100%;
    height: 520px;
    margin-left: .04rem;

    .lyr_container {
        padding-top: 20px;
        padding-bottom: 20px;
        background: #202020;
        color: #666;
        width: 99%;
        height: 520px;
        overflow: hidden;
        text-align: center;
        border-radius: 5px;

        /* border: 2px solid #fff; */
        .lrc-list {
            /* border: 2px solid #fff; */
            width: 100%;
            transition: 0.6s;
            list-style: none;
            height: fit-content;

            .lrc-item {
                max-width: 100%;
                min-height: 20px;
                font-size: 14px;
                text-wrap: wrap;
                transition: 0.2s;
            }

            .lrc-item.active {
                color: #ccc;
                /* font-size: ; */
                transform: scale(1.1) !important;
            }
        }
    }


}
</style>