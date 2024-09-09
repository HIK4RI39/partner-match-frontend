<template>
  <van-row>
    <van-col span="24">
      <van-cell
          :title= otherUser?.username
          style="background: #213547; text-align: center; color: white"/>
    </van-col>
  </van-row>

  <div >
    <van-list v-for="message in messages">

      <van-row type="fixed" justify="end"
      style="margin-bottom: 10px">
        <van-cell class="message-me" v-if="message.sender==='me'">
          <span style="color: #242121">
            {{(message?.content).toString().replace("\"","").replace("\"","")}}
          </span>
          <van-image
              round fit="cover" width="30px" height="30px" style="margin-left: 5px"
              :src=currentUser?.avatarUrl
          />
        </van-cell>
      </van-row>



      <van-cell class="message-other" v-if="message.sender!=='me'">
        <van-image
            round fit="cover" width="30px" height="30px" style="margin-left: 5px"
            :src=otherUser?.avatarUrl
        />
        {{message?.content}}

      </van-cell >

    </van-list >
  </div>


  <div style="height: 5rem;">
    <van-cell-group inset>
      <van-field
          class="bottom"
          v-model="text"
          center
          clearable
          placeholder="请输入消息"
      >
        <template #button>
          <van-button size="normal" type="primary" @click="onSend(text)">发送</van-button>
        </template>
      </van-field>
    </van-cell-group>
  </div>



</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {GetCurrentUser} from "../../services/user.ts";
import {showToast} from "vant";
import {UserType} from "../../models/user";
import {useRoute} from "vue-router";
import myAxios from "../../plugins/myAxios.ts";
import {BaseResponse} from "../../models/baseResponse";

const route = useRoute();
const {id} = route.query;

const currentUser:Ref<UserType> = ref();
const otherUser:Ref<UserType> = ref();


const messages = ref([])

//获取链接时触发
const onOpen = (e) => {
  console.log("成功连接!",e)
};

//接收到服务端推送的消息后触发
const onMessage = async (event) => {
  //获取服务器推送过来的消息
  let dataString = event.data
  //将dataString转化为json对象
  let response = JSON.parse(dataString)

  const res = await GetCurrentUser();
  if(res){
    currentUser.value = res;
  }else{
    showToast("用户未登录");
  }

  if(response.sender === currentUser.value.id){
    response["sender"] = 'me'
  }else{
    response["sender"] = 'other'
  }
  messages.value.push(response)
};

//
const onClose = () => {}
;

const webSocket = ref();

//ws服务器地址
webSocket.value = new WebSocket('ws://localhost:8081/chat?id='.concat(id))

webSocket.value.onopen = onOpen;
webSocket.value.onmessage = onMessage;
webSocket.value.onclose = onClose;

onMounted(async () => {
  //获取当前用户
  const res = await GetCurrentUser();
  if(res){
    currentUser.value = res;
  }else{
    showToast("用户未登录");
  }

  myAxios.get('/user/avatarUrl/'+id?.toString()).then((res:BaseResponse) => {
    if(res.code===0){
      otherUser.value = res.data
    }})
});

const text = ref('');

const onSend = (msg:string) => {
  msg = msg.trim();

  if(msg===null || msg===''){
    showToast("请勿发送空白信息");
    return;
  }

  //向后端发送消息
  webSocket.value.send(JSON.stringify(msg))

  text.value = "";


}





</script>

<style scoped>
.message-me {
  background-color: limegreen;
  max-width: 280px;
  word-wrap: break-word; /* 处理英文单词换行 */
  word-break: break-all; /* 处理中文换行 */
  display: inline-block; /*将div元素转换为行内块元素*/
  width: auto; /* 宽度根据文本宽度自动调正*/
  padding: 6px 12px;
  border-radius: 4px;
  color: black;
}

.message-other {
  background-color: rgba(242, 243, 245, 1);
  max-width: 280px;
  word-wrap: break-word; /* 处理英文单词换行 */
  word-break: break-all; /* 处理中文换行 */
  display: inline-block; /*将div元素转换为行内块元素*/
  width: auto; /* 宽度根据文本宽度自动调正*/
  padding: 6px 12px;
  border-radius: 4px;
}



.bottom {
  position: fixed;
  bottom: 40px;
}


</style>

