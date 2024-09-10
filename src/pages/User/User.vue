<template>
  <div>
    <van-cell title="当前用户" :value="user?.username"/>
    <van-cell title="修改个人信息" is-link to="/user/info" />
    <van-cell title="我创建的队伍" is-link to="/user/myTeams" />
    <van-cell title="我加入的队伍" is-link to="/user/joinedTeams"/>
  </div>

  <div style="margin: 16px;">
    <van-button round block type="danger" @click="doLogout">
      退出
    </van-button>
  </div>

</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {showToast} from "vant";
import {GetCurrentUser} from "../../services/user.ts";
import {useRouter} from 'vue-router'
import myAxios from "../../plugins/myAxios.ts";
import {BaseResponse} from "../../models/baseResponse";

const router = useRouter()
const user = ref();

const doLogout = async () => {
  await myAxios.post("/user/logout").then((res:BaseResponse)=>{
    if(res.code===0){
      showToast("退出登录");
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  })
}

onMounted(async () => {
  const res = await GetCurrentUser();
  if(res){
    user.value = res;
  }else{
    showToast("用户未登录");
    // //跳转登录页
    // setTimeout(() => {
    //   router.replace('/user/login');
    // }, 500);
  }
})

const toEdit = (editKey: string, editName: string, currentValue: any) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey: editKey,
      editName: editName,
      currentValue: currentValue
    }
  })
}

const toAvatar = (currentValue:string) => {
  router.push({
    path: '/user/avatar',
    query: {
      avatarUrl: currentValue,
    }
  })
}
</script>

<style scoped>

</style>