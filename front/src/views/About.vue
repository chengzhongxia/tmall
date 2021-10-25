<template lang="pug">
el-form.w50(label-position="left" label-width="100px" :model="formData")
  el-form-item(label="用户名")
    el-input(v-model="formData.userName")
  el-form-item(label="密码")
    el-input(v-model="formData.password")
  el-form-item
    el-button(type="primary" @click="submit(0)")
      | 注册
    el-button(type="primary" @click="submit(1)")
      | 登录

el-input(v-model="message")  
el-button(type="primary" @click="sendMessage") websocket 发送 

</template>

<script lang="ts">
import { defineComponent, ref, reactive, onBeforeUnmount, onMounted } from "vue";
import http from '@/http';
import { IToken } from '@/types/user'
export default defineComponent({
  setup() {
    const formData = reactive({ userName: '', password: '' })
    async function submit(flag: number) {
      console.log('提交！');
      if (flag) {
        const { data } = await http.post('/user/login', formData)
        localStorage.setItem('token', (data as IToken).token)
      }
    }

    const message = ref('')
    /* websocket */
    // let websocket: WebSocket

    // const initWebsocket = () => {
    //   websocket = new WebSocket('ws://localhost:3002')
    //   console.log(websocket);

    //   websocket.onopen = (e: Event) => {
    //     console.log('连接开启', e);
    //   }
    //   websocket.onclose = (e: Event) => {
    //     console.log('连接关闭', e);
    //   }
    //   websocket.onerror = (e: Event) => {
    //     console.log('连接发生错误', e);
    //   }
    //   websocket.onmessage = (e: Event) => {
    //     console.log('连接message', e);
    //   }
    // }
    // onBeforeUnmount(() => {
    //   websocket
    // })



    // onMounted(() => {
    //   initWebsocket()
    // })

    let ws: WebSocket
    const init = () => {
      ws = new WebSocket('ws://localhost:3002')
      ws.onclose = close;
      ws.onerror = onError;
      ws.onopen = open;
      ws.onmessage = onMessage;
    }
    const open = () => {
      console.log("connect success")
    }

    const onMessage = () => {
      console.log("发生消息")
    }

    const close = () => {  //关闭
      console.log('断开连接');
    }

    const onError = () => {
      console.log('连接异常');
    }

    const sendMessage = () => {
      try {
        ws.send(message.value)
      } catch {
        console.log('send message error!');
      }
    }

    onMounted(() => {
      init();
    })

    return {
      formData,
      submit,
      message,
      sendMessage
    }
  }
})
</script>
