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

      <van-row type="fixed" justify="end" style="margin-top: 10px;margin-right: 10px" v-if="message.sender==='me'">
        <!--用户名-->
        <van-cell>
          <span style="color: #242121;font-weight: bold;">
            {{currentUser?.username}}
          </span>
        </van-cell>
        <!--发送时间-->
        <span style="font-size: 11px; margin-top: 20px; margin-right: 5px">
          {{timer(message.sendTime)}}
        </span>
        <!--内容-->
        <van-cell class="message-me" >
          <span style="color: #242121; font-size: 15px">
            {{(message?.content).toString().replace("\"","").replace("\"","")}}
          </span>
        </van-cell>
        <!--头像-->
        <van-image
            round fit="cover" width="30px" height="30px" style="margin-left: 5px"
            :src=currentUser?.avatarUrl
        />
      </van-row>


      <van-row style="margin-top: 10px; margin-left: 10px" v-if="message.sender!=='me'">
        <!--用户名-->
        <van-cell>
          <span style="color: #242121; font-weight: bold;float: left;">
            {{otherUser?.username}}
          </span>
        </van-cell>
        <!--头像-->
        <van-image
            round fit="cover" width="30px" height="30px" style="margin-left: 5px"
            :src=otherUser?.avatarUrl
        />
        <!--内容-->
        <van-cell class="message-other" >
          <span style="color: #242121; font-size: 15px">
            {{(message?.content).toString().replace("\"","").replace("\"","")}}
          </span>
        </van-cell>
        <!--发送时间-->
        <span style="font-size: 11px; margin-top: 20px; margin-right: 5px">
          {{timer(message.sendTime)}}
        </span>

      </van-row>




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
import {showToast} from "vant";
import {UserType} from "../../models/user";
import {useRoute} from "vue-router";
import myAxios from "../../plugins/myAxios.ts";
import {BaseResponse} from "../../models/baseResponse";
import {GetCurrentUser} from "../../services/user.ts";

const route = useRoute();

const timer = (time:number) => {
  var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
  return date.toJSON().substring(0, 19).replace('T', ' ');
}


const {id} = route.query;
const currentUser:Ref<UserType> = ref();
const otherUser:Ref<UserType> = ref();

const messages = ref([])
const webSocket = ref();



const init = () => {
  //ws服务器地址
  webSocket.value = new WebSocket(`ws://localhost:8081/websocket/chat?id=${id}&uid=${currentUser.value.id}&teamId=`)
  // webSocket.value = new WebSocket('ws://user-center:8081/websocket/chat?id='.concat(id).concat("&uid=").concat(currentUser.value.id))
  // webSocket.value = new WebSocket('ws://101.34.76.44:8081/websocket/chat?id='.concat(id).concat("&uid=").concat(currentUser.value.id))

  webSocket.value.onopen = (e) => {
    console.log("成功连接!",e)
  };
  webSocket.value.onmessage = (event) => {
    //获取服务器推送过来的消息
    let dataString = event.data
    //将dataString转化为json对象
    let response = JSON.parse(dataString)

    if(response.sender === currentUser.value.id){
      response["sender"] = 'me'
    }else{
      response["sender"] = 'other'
    }

    messages.value.push(response)
  };

  webSocket.value.onclose = (e) => {
    console.log("链接已关闭!",e)
  };

  webSocket.value.onerror = (e) => {
    console.log("发生错误: ",e)
  };
}

onMounted(async () => {
  const res = await GetCurrentUser();
  if(res){
    currentUser.value = res;
    init();
  }else{
    showToast("用户未登录");
  }


  myAxios.get('/user/avatarUrl/'+id).then((res:BaseResponse) => {
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

