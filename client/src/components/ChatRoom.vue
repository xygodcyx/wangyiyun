<template>
    <div class="chatRoom">
        <div class="showContent">
            <div class="messageItem" v-for="message in chats">{{ message }}</div>
        </div>
        <div class="chatInputBox">
            <div class="messageInput">
                <input type="text" v-model="wantSendMessage" placeholder="和小伙伴们说点什么吧">
                <button class="sendBtn" @click="sendMessage">发送</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const chats = ref<Array<string>>([""]);
const wantSendMessage = ref("");
const socket = ref<WebSocket>();
onMounted(() => {
    // 创建WebSocket连接
    socket.value = new WebSocket('ws://localhost:3000');
    // 当WebSocket连接打开时，触发这个事件
    socket.value.addEventListener('open', (event) => {
        console.log('Connected to the WebSocket server');
    });
    // 当WebSocket接收到服务器的消息时，触发这个事件
    socket.value.addEventListener('message', (event) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target) {
                const str: string = event.target.result as string;
                chats.value.push(str);
            }
        }
        reader.readAsText(event.data)

    });

})
// 发送消息给服务器
const sendMessage = () => {
    const message = wantSendMessage.value;
    if (socket.value) {
        socket.value.send(message);
    }
    wantSendMessage.value = '';
}
</script>

<style scoped lang="less">
.chatRoom {
    width: 90vw;
    margin: 0 auto;
    height: 24vh;
    z-index: 9999 !important;
    margin-top: -20px;

    .showContent {
        width: 90vw;
        height: 18vh;
        margin: 0 auto;
        border: 1px solid black;
        overflow-x: hide;
        z-index: 9999;
    }

    .chatInputBox {
        margin-top: 10px;

        .messageInput {
            display: flex;
            justify-content: space-between;

            input {
                outline: none;
                border: 1px solid lightcoral;

                &::placeholder {
                    text-align: center;
                }
            }

            .sendBtn {
                width: 60px;
                height: 50px;
                outline: none;
                border: none;
                background-color: rgb(116, 143, 143);
                border-radius: 5px;
                transition: transform 0.1s;

                transform: scale(1);


                &:active {
                    transform: scale(1.2);
                }
            }
        }
    }
}
</style>