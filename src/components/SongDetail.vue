<style lang="less">
#songDetail.songDetail {
    width: 100vw;
    height: 100vh;
    // overflow-y: hidden;
    overflow-x: hidden;
}

@keyframes songPlaying {
    0% {
        transform: rotate(0deg);
    }

    50% {
        transform: rotate(180deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

#drawer-wrap.drawer-wrap {
    width: 90vw;
    height: 69vh;
    // overflow-y: hidden;

    .cover.hide {
        opacity: 0;
    }

    .cover {
        width: 100%;
        height: 69vh;
        display: flex;
        flex-direction: column;
        justify-content: left;
        align-items: center;
        margin-top: 2rem;
        position: absolute;
        z-index: 99;
        transition: all 0.4s;
        --cover-img: 10px;
        opacity: 1;

        .name {
            width: 100%;
            text-align: center;
            font-size: 32px;
            font-weight: 600;
            text-shadow: 1px 1px salmon;
            opacity: 1;
        }

        .cover-background {
            width: 320px;
            height: 320px;
            border-radius: 50%;
            background-color: rgb(8, 42, 31);
            position: absolute;
            top: 41px;
            left: 46px;
            opacity: 0.3;
            margin-top: var(--cover-img)
        }

        .cover-img {
            margin-top: var(--cover-img);
            width: 300px;
            height: 300px;
            border-radius: 50%;
            animation: songPlaying 20s infinite linear;
        }

        .author-name {
            width: 100%;
            text-align: center;
            font-size: 18px;
            font-weight: 600;
            text-shadow: 1px 1px rgb(248, 226, 223);
            margin-top: 20px;
            opacity: 1;
        }


    }

    .songIyric {
        transition: all 0.2s;
        opacity: 0;
        width: 90vw;
        left: 5.1%;
        position: absolute;
        z-index: 1;

        .songIyricContent {
            width: 100%;
        }

        .name-wrap {
            width: 100vw;

            .name {
                width: 100vw;

                text-align: center;
                font-size: 22px;
                font-weight: 600;
                text-shadow: 1px 1px salmon;
                opacity: 1;
            }
        }


    }

    .songIyric.show {
        opacity: 1;
        z-index: 999;

    }
}
</style>

<template>

    <div id="songDetail" class="songDetail">
        <n-drawer :on-after-leave="onAfterLeave" :on-after-enter="onAfterEnter" class="drawer"
                  v-model:show="showSongDetail" style="width: 100vw; height: 100vh" placement="bottom">
            <div id="drawer-wrap" class="drawer-wrap">
                <button @click="closeSongDetail">返回</button>
                <div :class="[CoverClass, 'cover']">
                    <p class="name">{{ SongManger.nowSong.name }}</p>
                    <div class="cover-background"></div>
                    <img @click="clickOver" class="cover-img" :src="SongManger.nowSong.al.picUrl" alt="" />
                    <div class="author-name">
                        <n-ellipsis :line-clamp="1">
                            <span v-bind:key="index" v-for="(author, index) in SongManger.nowSong?.ar">{{
                                index == SongManger.nowSong!.ar.length - 1 ? author.name : author.name + '/'
                            }}</span>
                        </n-ellipsis>
                    </div>
                </div>
                <div :class="[SongIyricClass, 'songIyric']">
                    <n-ellipsis class="name-wrap" :line-clamp="1">
                        <p class="name">{{ SongManger.nowSong.name }}</p>
                    </n-ellipsis>
                    <SongIyric @click="hideSongIyric" class="songIyricContent"></SongIyric>

                </div>
            </div>
            <ChatRoom></ChatRoom>

        </n-drawer>

    </div>
</template>



<script setup lang="ts">
import {
    ref,
    computed,
} from 'vue';
import { useSongManger } from '@/stores/SongManager';
import AlertBox from './AlertBox/';
import request from '@/request';
import SongIyric from './SongIyric.vue';
import type { TSongLyric } from '@/type';
import { useGlobalVarStore } from '@/stores/GlobalVar';
const { getSongUrlNew, getSongLyric } = request;
import ChatRoom from "@/components/ChatRoom.vue"
const SongManger = useSongManger();
const showSongDetail = defineModel<boolean>({
    type: Boolean,
    default: false
})
const SongIyricClass = ref<Array<string>>([])
const CoverClass = ref<Array<string>>([])
const GlobalVar = useGlobalVarStore()
const closeSongDetail = () => {
    showSongDetail.value = false
    GlobalVar.inSongDetail = false

    GlobalVar.removeSongPlayClass("inSongDetail")
}
const onAfterEnter = () => {
    // GlobalVar.removeSongPlayClass("inPlayList")
}
const clickOver = () => {
    setTimeout(() => {
        addSongIyricClass("show")
    }, 100)
    addCoverClass("hide")
}
const hideSongIyric = () => {
    removeSongIyricClass("show")
    setTimeout(() => {
        removeCoverClass("hide")
    }, 160)

}
const addCoverClass = (className = '') => {
    let has = CoverClass.value.indexOf(className) !== -1;
    if (!has) CoverClass.value.push(className);
};
const removeCoverClass = (className = '') => {
    CoverClass.value.splice(CoverClass.value.indexOf(className), 1);
};
const addSongIyricClass = (className = '') => {
    let has = SongIyricClass.value.indexOf(className) !== -1;
    if (!has) SongIyricClass.value.push(className);
};
const removeSongIyricClass = (className = '') => {
    SongIyricClass.value.splice(SongIyricClass.value.indexOf(className), 1);
};
const onAfterLeave = () => {
    if (GlobalVar.inPlaylist) {
        GlobalVar.addSongPlayClass("inPlayList")
    }
    if (GlobalVar.inSearchDetail) {
        GlobalVar.addSongPlayClass("inSearchDetail")
    }
}
</script>
