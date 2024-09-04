<template>
  <div>
    <van-cell title="昵称" is-link to="/user/edit" :value="user?.username" @click="toEdit('username', '昵称', user.username)"/>


    <van-cell title="头像" @click="toAvatar(user?.avatarUrl)">
      <img style="height: 72px; width: 72px" :src="user?.avatarUrl">
    </van-cell>

    <van-cell title="账号"  :value="user?.userAccount" />
    <van-cell title="性别" is-link to="/user/edit" :value="user?.gender" @click="toEdit('gender', '性别', user.gender)" />
    <van-cell title="电话" is-link to="/user/edit" :value="user?.phone" @click="toEdit('phone', '电话', user.phone)" />
    <van-cell title="邮箱" is-link to="/user/edit" :value="user?.email" @click="toEdit('email', '邮箱', user.email)"/>
    <van-cell title="注册时间" :value="user?.createTime.toString()" />
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
import {GetCurrentUser} from "../services/user.ts";
import {useRouter} from 'vue-router'
import myAxios from "../plugins/myAxios.ts";
import {BaseResponse} from "../models/baseResponse";

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