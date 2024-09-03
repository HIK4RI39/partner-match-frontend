<template>
  <div>
    <van-nav-bar
        title="标题"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
    >
      <template #right>
        <van-icon name="search" size="18"/>
      </template>
    </van-nav-bar>


    <div id="content">
      <!--占位符-->
      <router-view></router-view>
    </div>


    <van-tabbar route v-model="active" @change="onChange">
      <van-tabbar-item icon="home-o" name="index" replace to="/">主页</van-tabbar-item>
      <van-tabbar-item icon="search" name="team" replace to="/team">队伍</van-tabbar-item>
      <van-tabbar-item icon="friends-o" name="user" replace to="/user">个人</van-tabbar-item>
    </van-tabbar>

  </div>

</template>

<script setup lang="ts">
import {ref} from 'vue';
import {showToast} from "vant";
import {useRouter} from 'vue-router'
const router = useRouter()

const onClickLeft = () => history.back();
const onClickRight = () => router.push('/search');

const active = ref('index');
const onChange = (index: any) => showToast(`标签 ${index}`);
</script>

<style scoped>

</style>